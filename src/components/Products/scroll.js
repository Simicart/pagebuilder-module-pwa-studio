import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './scroll.css';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { CarefreeHorizontalScroll } from '../CarefreeHorizontalScroll/CarefreeHorizontalScroll';

export const ProductScroll = props => {
    const { item } = props;
    let filterData = { category_id: { eq: '6' } };
    let sortData;
    let pageSize = 8;
    if (item.dataParsed) {
        const { dataParsed } = item;
        if (dataParsed.openProductsWidthSKUs) {
            let openProductsWidthSKUs = item.dataParsed.openProductsWidthSKUs;
            openProductsWidthSKUs = openProductsWidthSKUs.trim();
            openProductsWidthSKUs = openProductsWidthSKUs.split(',');
            filterData = {
                sku: {
                    in: openProductsWidthSKUs
                }
            };
        } else if (dataParsed.openCategoryProducts) {
            filterData = {
                category_id: { eq: String(dataParsed.openCategoryProducts) }
            };
        }
        if (dataParsed.openProductsWidthSortAtt) {
            const directionToSort = dataParsed.openProductsWidthSortDir
                ? dataParsed.openProductsWidthSortDir.toUpperCase()
                : 'ASC';
            sortData = {};
            sortData[dataParsed.openProductsWidthSortAtt] = directionToSort;
        }
        if (dataParsed.openProductsWidthSortPageSize) {
            pageSize = parseInt(dataParsed.openProductsWidthSortPageSize);
        }
    }

    const { data, loading, storeConfig } = useProducts({
        filterData,
        sortData,
        pageSize
    });
    const classes = mergeClasses(defaultClasses, props.classes);

    if (
        data &&
        data.products &&
        data.products.items &&
        data.products.items.length &&
        storeConfig
    ) {
        const products = data.products.items.map((productItem, indx) => {
            return (
                <GalleryItem key={indx} item={productItem} classes={classes} storeConfig={storeConfig} />
            );
        });

        return (
            <CarefreeHorizontalScroll item={item}>
                {products}
            </CarefreeHorizontalScroll>
        );
    } else if (loading) {
        return <LoadingIndicator />;
    }
    return '';
};
