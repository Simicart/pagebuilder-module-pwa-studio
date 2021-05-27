import React from 'react';
import { PageBuilderComponent } from 'simi-pagebuilder-react';
import ProductList from './components/Products/list';
import ProductGrid from './components/Products/grid';

const page1 = props => {
    return <PageBuilderComponent
        endPoint="https://magento24.pwa-commerce.com/pb/graphql/"
        maskedId="14ma8aNkguI86ynO2CxoGy1621591997"
        ProductList={ProductList}
        ProductGrid={ProductGrid}
    />
}

export default page1;