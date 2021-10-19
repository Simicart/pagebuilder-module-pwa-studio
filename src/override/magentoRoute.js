import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useMagentoRoute } from '@magento/peregrine/lib/talons/MagentoRoute';

import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useLocation, Link, useHistory } from 'react-router-dom';
import { usePbFinder, PageBuilderComponent } from 'simi-pagebuilder-react';
import ProductDetails from '../components/ProductDetails';
import ProductList from '../components/Products/list';
import ProductGrid from '../components/Products/grid';
import Category from '../components/Category';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { ProductScroll } from '../components/Products/scroll';
import { CategoryScroll } from '../components/Category/scroll';
const storage = new BrowserPersistence();
const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;

const endPoint = 'https://magento24.pwa-commerce.com/pb/graphql/';
//const endPoint = 'https://tapita.io/pb/graphql/';
const integrationToken = '2xBXodtu16OPOKsWKcxA3riSeDkRpDL1622517111';

const MESSAGES = new Map()
    .set(
        'NOT_FOUND',
        "Looks like the page you were hoping to find doesn't exist. Sorry about that."
    )
    .set('INTERNAL_ERROR', 'Something went wrong. Sorry about that.');

const MagentoRoute = () => {
    const location = useLocation();
    const pbFinderProps = usePbFinder({
        endPoint,
        integrationToken,
        storeCode
    });
    const {
        loading: pbLoading,
        pageMaskedId,
        findPage,
        pathToFind,
        catalogItemIdToFind,
        pageData
    } = pbFinderProps;
    const { formatMessage } = useIntl();

    const talonProps = useMagentoRoute();
    const {
        component: RootComponent,
        id,
        isLoading,
        isNotFound,
        isRedirect,
        hasError,
        type
    } = talonProps;

    useEffect(() => {
        if (type === 'PRODUCT' && id) {
            if (catalogItemIdToFind !== id) findPage(false, id);
        } else if (
            location &&
            location.pathname &&
            (isNotFound || hasError || location.pathname === '/')
        ) {
            if (!pageMaskedId || location.pathname !== pathToFind)
                findPage(location.pathname);
        }
    }, [
        location,
        pageMaskedId,
        isNotFound,
        pathToFind,
        catalogItemIdToFind,
        findPage,
        hasError
    ]);

    if (
        pageMaskedId &&
        pageMaskedId !== 'notfound' &&
        (isNotFound ||
            hasError ||
            location.pathname === '/' ||
            type === 'PRODUCT')
    ) {
        try {
            if (document.getElementsByTagName('header')[0])
                document.getElementsByTagName(
                    'header'
                )[0].nextSibling.style.maxWidth = 'unset';
        } catch (err) {
            console.warn(err);
        }
        const pbcProps = {
            pageData: pageData && pageData.publish_items ? pageData : false,
            ProductList: ProductList,
            ProductGrid: ProductGrid,
            ProductScroll: ProductScroll,
            CategoryScroll: CategoryScroll,
            Category: Category,
            formatMessage: formatMessage,
            Link: Link,
            history: history
        };
        return (
            <React.Fragment>
                {type === 'PRODUCT' ? (
                    <ProductDetails productId={id} {...pbcProps} />
                ) : (
                    <PageBuilderComponent
                        key={pageMaskedId}
                        endPoint={endPoint}
                        {...pbcProps}
                    />
                )}
            </React.Fragment>
        );
    } else if (pbLoading) {
        return fullPageLoadingIndicator;
    }
    try {
        if (document.getElementsByTagName('header')[0])
            document.getElementsByTagName(
                'header'
            )[0].nextSibling.style.maxWidth = '1440px';
    } catch (err) {
        console.warn(err);
    }

    if (isLoading || isRedirect) {
        return fullPageLoadingIndicator;
    } else if (RootComponent) {
        if (
            !pageMaskedId &&
            location &&
            location.pathname &&
            location.pathname === '/'
        ) {
            return fullPageLoadingIndicator;
        }
        return <RootComponent id={id} />;
    } else if (isNotFound) {
        if (!pageMaskedId && location && location.pathname) {
            return fullPageLoadingIndicator;
        }
        return (
            <ErrorView
                message={formatMessage({
                    id: 'magentoRoute.routeError',
                    defaultMessage: MESSAGES.get('NOT_FOUND')
                })}
            />
        );
    }

    return (
        <ErrorView
            message={formatMessage({
                id: 'magentoRoute.internalError',
                defaultMessage: MESSAGES.get('INTERNAL_ERROR')
            })}
        />
    );
};

export default MagentoRoute;
