import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';
import defaultClasses from './list.css';
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

const ProductList = props => {
    const { item } = props;
    let filterData = { category_id: { eq: '6' } };
    let sortData;
    let pageSize = 6;
    if (item.dataParsed) {
        const { dataParsed } = item;
        if (dataParsed.openProductsWidthSKUs) {
            let openProductsWidthSKUs = item.dataParsed.openProductsWidthSKUs;
            openProductsWidthSKUs = openProductsWidthSKUs.trim();
            openProductsWidthSKUs = openProductsWidthSKUs.split(",");
            filterData = {
                sku: {
                    in: openProductsWidthSKUs
                }
            }
        } else if (dataParsed.openCategoryProducts) {
            filterData = { category_id: { eq: String(dataParsed.openCategoryProducts) } };
        }
        if (dataParsed.openProductsWidthSortAtt) {
            let directionToSort = dataParsed.openProductsWidthSortDir ? dataParsed.openProductsWidthSortDir.toUpperCase() : 'ASC';
            sortData = {};
            sortData[dataParsed.openProductsWidthSortAtt] = directionToSort;
        }
        if (dataParsed.openProductsWidthSortPageSize) {
            pageSize = parseInt(dataParsed.openProductsWidthSortPageSize);
        }
    }

    const { data, loading } = useProducts({ filterData, sortData, pageSize });
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
                        data.products.items.map((productItem, indx) => {
                            return <GalleryItem key={indx} item={mapGalleryItem(productItem)} classes={classes} />
                        })}

                </div>
            </div>
        )
    } else if (loading) {
        return <LoadingIndicator />
    }
    return ''
}

export default ProductList;