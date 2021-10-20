import React, { Fragment, Suspense, useCallback, useMemo } from 'react';
import { PageBuilderComponent } from 'simi-pagebuilder-react';
import mapProduct from '@magento/venia-ui/lib/util/mapProduct';
import { useProduct } from '@magento/peregrine/lib/talons/RootComponents/Product/useProduct';
import { StoreTitle, Meta } from '@magento/venia-ui/lib/components/Head';

import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { Info } from 'react-feather';

import Price from '@magento/venia-ui/lib/components/Price';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Button from '@magento/venia-ui/lib/components/Button';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { QuantityFields } from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';
import RichText from '@magento/venia-ui/lib/components/RichText';
import defaultClasses from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.css';
import customClasses from './productFullDetail.css';
import ReactDOM from 'react-dom';
import { useWindowSize } from '@magento/peregrine';

const WishlistButton = React.lazy(() =>
    import('@magento/venia-ui/lib/components/Wishlist/AddToListButton')
);
const Options = React.lazy(() =>
    import('@magento/venia-ui/lib/components/ProductOptions')
);

// Correlate a GQL error message to a field. GQL could return a longer error
// string but it may contain contextual info such as product id. We can use
// parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const ProductFullDetail = props => {
    const { product, pbProps } = props;
    const windowSize = useWindowSize();
    const talonProps = useProductFullDetail({ product });

    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        isAddToCartDisabled,
        isSupportedProductType,
        mediaGalleryEntries,
        productDetails,
        wishlistButtonProps
    } = talonProps;
    const { formatMessage } = useIntl();

    const classes = useStyle(customClasses, defaultClasses, props.classes);

    const options = isProductConfigurable(product) ? (
        <Options
            onSelectionChange={handleSelectionChange}
            options={product.configurable_options}
        />
    ) : null;

    const breadcrumbs = useMemo(
        () =>
            breadcrumbCategoryId ? (
                <Breadcrumbs
                    categoryId={breadcrumbCategoryId}
                    currentProduct={productDetails.name}
                />
            ) : null,
        [breadcrumbCategoryId]
    );

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // this would be handled elsewhere with an error code and not a string.
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorToken',
                        defaultMessage:
                            'There was a problem with your cart. Please sign in again and try adding the item once more.'
                    })
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (
            errorMessage.includes('Variable "$cartId" got invalid value null')
        ) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorCart',
                        defaultMessage:
                            'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage:
                            'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

    const overRender = (item, itemProps, innerContent) => {
        if (!item || !itemProps || !productDetails) return false;
        const { type } = item;
        if (type === 'productbuilder_productname') {
            return (
                <h1 className={classes.productName} {...itemProps}>
                    {productDetails.name}
                </h1>
            );
        } else if (type === 'productbuilder_productprice') {
            let priceProps = JSON.parse(JSON.stringify(itemProps));
            if (priceProps.style) priceProps.style.flexDirection = 'row';
            return (
                <p className={classes.productPrice} {...priceProps}>
                    <Price
                        currencyCode={productDetails.price.currency}
                        value={productDetails.price.value}
                    />
                </p>
            );
        } else if (type === 'productbuilder_productstock') {
            return ' ';
        } else if (type === 'productbuilder_productimage') {
            let imageProps = JSON.parse(JSON.stringify(itemProps));
            if (imageProps.style) imageProps.style.overflowX = 'hidden';
            return <div {...itemProps} id="smpb-product-image-wrapper" />;
        } else if (type === 'productbuilder_productaddcart') {
            return (
                <button {...itemProps} type="submit">
                    <FormattedMessage
                        id={'productFullDetail.cartAction'}
                        defaultMessage={'Add to Cart'}
                    />
                </button>
            );
        } else if (type === 'productbuilder_productaddwishlist') {
            return (
                <div {...itemProps}>
                    <WishlistButton {...wishlistButtonProps} />
                </div>
            );
        } else if (type === 'productbuilder_productqty') {
            return (
                <div {...itemProps}>
                    <QuantityFields
                        classes={{ root: classes.quantityRoot }}
                        min={1}
                        message={errors.get('quantity')}
                    />
                </div>
            );
        } else if (type === 'productbuilder_productoptions') {
            return (
                <div
                    className={classes.options}
                    {...itemProps}
                    id="smpb-product-options-wrapper"
                />
            );
        } else if (type === 'productbuilder_productdesc') {
            return (
                <div {...itemProps}>
                    <RichText content={productDetails.description} />
                </div>
            );
        } else if (type === 'productbuilder_productbreadcrumb') {
            return <div {...itemProps}>{breadcrumbs}</div>;
        } else if (type === 'productbuilder_productattribute') {
            if (item.name) {
                let attributeString = item.name;
                attributeString = attributeString.substring(
                    attributeString.indexOf('{{') + 2,
                    attributeString.lastIndexOf('}}')
                );
                let attributeVal;
                if (attributeString.includes('.')) {
                    try {
                        const attributepaths = attributeString.split('.');
                        if (attributepaths && attributepaths.length) {
                            attributeVal = productDetails;
                            attributepaths.map(attributepath => {
                                if (attributeVal[attributepath])
                                    attributeVal = attributeVal[attributepath];
                            });
                        }
                    } catch (err) {
                        console.warn(err);
                    }
                }
                if (attributeVal && typeof attributeVal !== 'object')
                    return (
                        <div {...itemProps}>
                            {item.name.replace(
                                '{{' + attributeString + '}}',
                                attributeVal
                            )}
                        </div>
                    );
            }
        } else if (type === 'productbuilder_productreview') {
            return <></>;
        } else if (type === 'productbuilder_relatedproducts') {
            return <></>;
        }
        return false;
    };
    
    return (
        <Fragment>
            {product ? (
                <Form className={classes.root} onSubmit={handleAddToCart}>
                    <FormError
                        classes={{
                            root: classes.formErrors
                        }}
                        errors={errors.get('form') || []}
                    />
                    <div style={{ width: '100%', minWidth: '100vw' }}>
                        {useMemo(
                            () => (
                                <PageBuilderComponent
                                    {...pbProps}
                                    overRender={overRender}
                                />
                            ),
                            [product]
                        )}
                    </div>
                    {document.getElementById('smpb-product-options-wrapper') ? (
                        <>
                            {ReactDOM.createPortal(
                                options,
                                document.getElementById(
                                    'smpb-product-options-wrapper'
                                )
                            )}
                            {ReactDOM.createPortal(
                                <Carousel images={mediaGalleryEntries} />,
                                document.getElementById(
                                    'smpb-product-image-wrapper'
                                )
                            )}
                        </>
                    ) : (
                        ''
                    )}
                </Form>
            ) : (
                ''
            )}
        </Fragment>
    );
};

const ProductDetails = props => {
    const talonProps = useProduct({
        mapProduct
    });
    const { error, loading, product } = talonProps;
    if (loading && !product) return fullPageLoadingIndicator;
    if (error && !product) return <ErrorView />;
    if (!product) {
        return (
            <h1>
                <FormattedMessage
                    id={'product.outOfStockTryAgain'}
                    defaultMessage={
                        'This Product is currently out of stock. Please try again later.'
                    }
                />
            </h1>
        );
    }
    return (
        <React.Fragment>
            <StoreTitle>{product.name}</StoreTitle>
            <Meta name="description" content={product.meta_description} />
            <ProductFullDetail product={product} pbProps={props} />
        </React.Fragment>
    );
};

export default ProductDetails;
