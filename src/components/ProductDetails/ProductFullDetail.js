import React, { useMemo } from 'react';
import { PageBuilderComponent } from 'simi-pagebuilder-react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import Price from '@magento/venia-ui/lib/components/Price';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { QuantityFields } from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';
import RichText from '@magento/venia-ui/lib/components/RichText';
//import defaultClasses from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.css'; // pwa-studio 11 and sooner
import defaultClasses from '@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.module.css'; // pwa-studio 12 and later

import customClasses from './productFullDetail.css';
import ReactDOM from 'react-dom';
import { useWindowSize } from '@magento/peregrine';
import Rate from './Rate';

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
    const { product, pbProps, pageData } = props;
    const windowSize = useWindowSize();
    const talonProps = useProductFullDetail({ product });

    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
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

    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
        />
    ) : null;

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

    const pDetails = JSON.parse(JSON.stringify(product));
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
            if (pDetails && pDetails.stock_status) {
                return (
                    <div {...itemProps}>
                        {pDetails.stock_status === 'IN_STOCK'
                            ? formatMessage({ id: 'In Stock' })
                            : formatMessage({ id: 'Out Of Stock' })}
                    </div>
                );
            }
            return '';
        } else if (type === 'productbuilder_productimage') {
            let imageProps = JSON.parse(JSON.stringify(itemProps));
            if (imageProps.style) imageProps.style.overflowX = 'hidden';
            return <div {...itemProps} id="smpb-product-image-wrapper" />;
        } else if (type === 'productbuilder_productaddcart') {
            return (
                <button
                    {...itemProps}
                    type="submit"
                    className={`${itemProps.className} ${
                        classes.smpbAddCartBtn
                    }`}
                >
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
                            attributeVal = pDetails;
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
            let reviewProps = JSON.parse(JSON.stringify(itemProps));
            if (reviewProps.style) reviewProps.style.flexDirection = 'row';
            if (pDetails && pDetails.rating_summary)
                return (
                    <div {...reviewProps}>
                        <Rate
                            rate={pDetails.rating_summary}
                            review_count={pDetails.review_count}
                        />
                        {pDetails.review_count && (
                            <span style={{ marginInlineStart: 4 }}>
                                ({pDetails.review_count})
                            </span>
                        )}
                    </div>
                );
            return <></>;
        } else if (type === 'productbuilder_relatedproducts') {
            if (
                pDetails &&
                pDetails.related_products &&
                pDetails.related_products.length &&
                pbProps &&
                pbProps.ProductGrid
            ) {
                const { ProductGrid } = pbProps;
                let skus = pDetails.related_products.map(relatedP => {
                    return relatedP.sku;
                });
                return (
                    <div {...itemProps}>
                        <ProductGrid
                            item={{
                                dataParsed: {
                                    openProductsWidthSKUs: skus.join(',')
                                }
                            }}
                        />
                    </div>
                );
            }
            return <></>;
        }
        return false;
    };

    return (
        <div
            className={`${classes.smProductBuilderRoot} ${
                (isAddToCartDisabled || isOutOfStock) ? classes.addToCartDisabled : ''
            }`}
        >
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
                                    lazyloadPlaceHolder={null}
                                    pageData={pageData}
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
        </div>
    );
};

export default ProductFullDetail;
