import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';
import defaultClasses from './grid.css';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};

const ProductGrid = props => {
    const { item } = props;
    let filterData = { category_id: { eq: '6' } };
    if (item.dataParsed) {
        if (item.dataParsed.openProductsWidthSKUs) {
            let openProductsWidthSKUs = item.dataParsed.openProductsWidthSKUs;
            openProductsWidthSKUs = openProductsWidthSKUs.trim();
            openProductsWidthSKUs = openProductsWidthSKUs.split(",");
            filterData = {
                sku: {
                    in: openProductsWidthSKUs
                }
            }
        } else if (item.dataParsed.openCategoryProducts) {
            filterData = { category_id: { eq: String(item.dataParsed.openCategoryProducts) } };
        }
    }

    const { data, loading } = useProducts({ filterData });
    const classes = mergeClasses(defaultClasses, props.classes);
    if (data && data.products && data.products.items && data.products.items.length) {
        return data.products.items.map(productItem => {
            return <GalleryItem key={item.id} item={mapGalleryItem(productItem)} classes={classes} />
        })
    } else if (loading) {
        return <LoadingIndicator />
    }
    return ''
}

export default ProductGrid;