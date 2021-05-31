import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useMagentoRoute } from '@magento/peregrine/lib/talons/MagentoRoute';

import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { useLocation } from 'src/drivers';
import PageBuilderPage from '../components/PageBuilderPage';
import { usePbFinder } from '../hooks/usePbFinder';

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
        endPoint
    } = usePbFinder();
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
        return <PageBuilderPage endPoint={endPoint} maskedId={pageMaskedId} />
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
