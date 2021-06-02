import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useMagentoRoute } from '@magento/peregrine/lib/talons/MagentoRoute';

import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useLocation } from 'src/drivers';
import { usePbFinder, PageBuilderComponent } from 'simi-pagebuilder-react';
import ProductList from '../components/Products/list';
import ProductGrid from '../components/Products/grid';

const endPoint = "https://magento24.pwa-commerce.com/pb/graphql/";
const integrationToken = "14FJiubdB8n3Byig2IkpfM6OiS6RTO801622446444";

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
        findPage
    } = usePbFinder({
        endPoint,
        integrationToken
    });
    const { formatMessage } = useIntl();
    const talonProps = useMagentoRoute();
    const {
        component: RootComponent,
        id,
        isLoading,
        isNotFound,
        isRedirect
    } = talonProps;

    useEffect(() => {
        if (!pageMaskedId && location && location.pathname && (isNotFound || location.pathname === '/')) {
            findPage(location.pathname);
        }
    }, [location, pageMaskedId, isNotFound]);

    if (pageMaskedId && pageMaskedId !== 'notfound') {
        return <PageBuilderComponent
            endPoint={endPoint}
            maskedId={pageMaskedId}
            ProductList={ProductList}
            ProductGrid={ProductGrid}
        />
    } else if (pbLoading) {
        return fullPageLoadingIndicator;
    }

    if (isLoading || isRedirect) {
        return fullPageLoadingIndicator;
    } else if (RootComponent) {
        if (!pageMaskedId && location && location.pathname && location.pathname === '/') {
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
