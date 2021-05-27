import React from 'react';
import { useProducts } from '../Hooks/useProducts';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';
import defaultClasses from './list.css';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

const mapGalleryItem = item => {
    const { small_image } = item;
    return {
        ...item,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};

const ProductList = props => {
    const { item } = props;
    const filterData = { category_id: { eq: '42' } };
    const { data, loading } = useProducts({ filterData });
    const classes = mergeClasses(defaultClasses, props.classes);
    if (data && data.products && data.products.items && data.products.items.length) {
        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', overflow: 'hidden' }}>
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        marginBottom: 15,
                        justifyContent: 'space-between',
                    }}
                >
                    {item.name}
                </div>
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        flexWrap: 'nowrap',
                        overflow: 'auto',
                    }}
                >
                    {
                        data.products.items.map(productItem => {
                            return <GalleryItem item={mapGalleryItem(productItem)} classes={classes} />
                        })}

                </div>
            </div>
        )
    }
    return ''
}

export default ProductList;