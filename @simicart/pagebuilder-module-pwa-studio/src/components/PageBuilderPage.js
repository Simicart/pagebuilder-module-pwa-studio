import React from 'react';
import { PageBuilderComponent } from 'simi-pagebuilder-react';
import ProductList from './Products/list';
import ProductGrid from './Products/grid';

const PageBuilderPage = props => {
    const { endPoint, maskedId } = props;
    return <PageBuilderComponent
        endPoint={endPoint}
        maskedId={maskedId}
        ProductList={ProductList}
        ProductGrid={ProductGrid}
    />
}

export default PageBuilderPage;