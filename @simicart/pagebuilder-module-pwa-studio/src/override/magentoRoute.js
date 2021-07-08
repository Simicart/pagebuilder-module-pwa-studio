import React, {useEffect} from 'react';
import {useIntl} from 'react-intl';
import {useMagentoRoute} from '@magento/peregrine/lib/talons/MagentoRoute';

import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import {fullPageLoadingIndicator} from '@magento/venia-ui/lib/components/LoadingIndicator';
import {useLocation} from 'src/drivers';
import {usePbFinder, PageBuilderComponent} from 'simi-pagebuilder-react';
import ProductList from '../components/Products/list';
import ProductGrid from '../components/Products/grid';
import Category from '../components/Category';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();
const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;

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
    const {
        loading: pbLoading,
        pageMaskedId,
        findPage,
        pathToFind,
        pageData
    } = usePbFinder({
        endPoint,
        integrationToken,
        storeCode,
        getPageItems: true
    });
    const {formatMessage} = useIntl();

    const talonProps = useMagentoRoute();
    const {
        component: RootComponent,
        id,
        isLoading,
        isNotFound,
        isRedirect
    } = talonProps;

    useEffect(() => {
        if (
            location &&
            location.pathname &&
            (isNotFound || location.pathname === '/')
        ) {
            if (!pageMaskedId || location.pathname !== pathToFind)
                findPage(location.pathname);
        }
    }, [location, pageMaskedId, isNotFound, pathToFind, findPage]);

    if (
        pageMaskedId &&
        pageMaskedId !== 'notfound' &&
        (isNotFound || location.pathname === '/')
    ) {
        try {
            document.getElementsByTagName('header')[0].nextSibling.style.maxWidth = 'unset';
        } catch (err) {
            console.warn(err);
        }
        return (
            <PageBuilderComponent
                key={pageMaskedId}
                endPoint={endPoint}
                maskedId={pageMaskedId}
                pageData={pageData && pageData.publish_items ? pageData : false}
                ProductList={ProductList}
                ProductGrid={ProductGrid}
                Category={Category}
                formatMessage={formatMessage}
            />
        );
    } else if (pbLoading) {
        return fullPageLoadingIndicator;
    }
    try {
        document.getElementsByTagName('header')[0].nextSibling.style.maxWidth = '1440px';
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
        return <RootComponent id={id}/>;
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
