import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useMagentoRoute } from '@magento/peregrine/lib/talons/MagentoRoute';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';

import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useLocation, Link, useHistory } from 'react-router-dom';
import { usePbFinder } from 'simi-pagebuilder-react';
import PageBuilderComponent from '../components/PageBuilderComponent';
import ProductDetails from '../components/ProductDetails';
import ProductList from '../components/Products/list';
import ProductGrid from '../components/Products/grid';
import Category from '../components/Category';
import { ProductScroll } from '../components/Products/scroll';
import { CategoryScroll } from '../components/Category/scroll';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();
const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;

//const endPoint = 'https://magento24.pwa-commerce.com/pb/graphql/';
const endPoint = 'https://tapita.io/pb/graphql/';
const integrationToken = '14FJiubdB8n3Byig2IkpfM6OiS6RTO801622446444';

const MESSAGES = new Map()
    .set(
        'NOT_FOUND',
        "Looks like the page you were hoping to find doesn't exist. Sorry about that."
    )
    .set('INTERNAL_ERROR', 'Something went wrong. Sorry about that.');

const MagentoRoute = () => {
    const location = useLocation();
    const history = useHistory();
    const pbFinderProps = usePbFinder({
        endPoint,
        integrationToken,
        storeCode
    });
    const { formatMessage } = useIntl();
    const {
        loading: pbLoading,
        findPage,
        pathToFind
    } = pbFinderProps;
    let { pageMaskedId, pageData } = pbFinderProps;

    
    const pbcProps = {
        ProductList: ProductList,
        ProductGrid: ProductGrid,
        ProductScroll: ProductScroll,
        CategoryScroll: CategoryScroll,
        Category: Category,
        formatMessage: formatMessage,
        Link: Link,
        history: history,
        endPoint,
        lazyloadPlaceHolder: <div />
    };
    //handle when preview - onsite
    if (location && location.search) {
        const previewMID = location.search.indexOf("pbPreviewMaskedId=");
        if (previewMID !== -1) {
            pageMaskedId = location.search.substring(previewMID + 18);
            pageData = false;
            pbcProps.toPreview = true;
        }
    }

    const talonProps = useMagentoRoute();
    const {
        component: RootComponent,
        isLoading,
        isNotFound,
        isRedirect,
        shimmer,
        initial,
        ...componentData
    } = talonProps;

    const {
        hasError,
        type,
    } = talonProps;

    useEffect(() => {
        if (
            location &&
            location.pathname &&
            (isNotFound || hasError || location.pathname === '/')
        ) {
            if (!pageMaskedId || location.pathname !== pathToFind)
                findPage(location.pathname);
        }
    }, [location, pageMaskedId, isNotFound, pathToFind, findPage, hasError]);

    if (
        pageMaskedId &&
        pageMaskedId !== 'notfound' &&
        (isNotFound || hasError || location.pathname === '/')
    ) {
        return (
            <PageBuilderComponent
                {...pbcProps}
                maskedId={pageMaskedId}
                pageData={pageData && pageData.publish_items ? pageData : false}
            />
        );
    } else if (pbLoading) {
        return fullPageLoadingIndicator;
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
        if (type === 'PRODUCT') {
            return (
                <ProductDetails
                    {...componentData}
                    pbcProps={pbcProps}
                    pbFinderProps={pbFinderProps}
                />
            );
        }

        return <RootComponent {...componentData} />;
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