import { gql } from '@apollo/client';

import { ProductDetailsFragment } from '@magento/peregrine/lib/talons/RootComponents/Product/productDetailFragment.gql';
import { GET_STORE_CONFIG_DATA } from '@magento/peregrine/lib/talons/RootComponents/Product/product.gql.js';

export const GET_PRODUCT_DETAIL_QUERY = gql`
    query getProductDetailForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                id
                rating_summary
                stock_status
                short_description {
                    html
                }
                only_x_left_in_stock
                review_count
                related_products {
                    id
                    sku
                }
                upsell_products {
                    id
                    sku
                }
                ...ProductDetailsFragment
            }
        }
    }
    ${ProductDetailsFragment}
`;

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getProductDetailQuery: GET_PRODUCT_DETAIL_QUERY
};
