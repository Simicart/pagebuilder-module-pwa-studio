import React from 'react';
import { useProducts } from '../Hooks/useProducts';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';
import defaultClasses from './grid.css';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

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
    const filterData = { category_id: { eq: '42' } };
    const { data, loading } = useProducts({ filterData });
    const classes = mergeClasses(defaultClasses, props.classes);
    if (data && data.products && data.products.items && data.products.items.length) {
        return data.products.items.map(productItem => {
            return <GalleryItem item={mapGalleryItem(productItem)} classes={classes} />
        })
    }
    return ''
}

export default ProductGrid;