import { useState } from 'react';
import { sendRequest } from './GraphQl';

const endPoint = "https://magento24.pwa-commerce.com/pb/graphql/";
const integrationToken = "14FJiubdB8n3Byig2IkpfM6OiS6RTO801622446444";

const GET_PB_PAGES_QUERY = `
    query getPagesByToken($integrationToken: String) {
        spb_page(integrationToken: $integrationToken) {
            total_count
            items {
                status
                masked_id
                name
                url_path
                priority
            }
        }		
    }
`;

export const usePbFinder = props => {
    const [pbData, setPbData] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pathToFind, setPathFoFind] = useState(false);
    let pageMaskedId;

    const findPage = (pathName) => {
        setPathFoFind(pathName);
        if (window.smPbPagesByToken) {
            setPbData(window.smPbPagesByToken);
        } else {
            if (!loading) {
                setLoading(true);
                sendRequest(
                    endPoint,
                    (result) => {
                        setLoading(false);
                        if (result && result.data && result.data.spb_page)
                            window.smPbPagesByToken = result;
                        setPbData(result);
                    },
                    GET_PB_PAGES_QUERY,
                    { integrationToken },
                    'getPbPage',
                );
            }
        }
    }

    if (pbData && pbData.data && pbData.data.spb_page && pathToFind) {
        const { spb_page } = pbData.data;
        pageMaskedId = 'notfound';
        if (spb_page.items && spb_page.items.length) {
            const pbPages = JSON.parse(JSON.stringify(spb_page.items));
            pbPages.sort((el1, el2) => parseInt(el2.priority) - parseInt(el1.priority));
            const pageToFind = pbPages.find(item => item.url_path === pathToFind);
            if (pageToFind && pageToFind.masked_id)
                pageMaskedId = pageToFind.masked_id;
        }
    }

    return {
        loading,
        pageMaskedId,
        findPage,
        endPoint
    };
}