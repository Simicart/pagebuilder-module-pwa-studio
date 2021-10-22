import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import GalleryItem from '@magento/venia-ui/lib/components/Gallery/item';
import defaultClasses from './list.css';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import { ChevronLeft, ChevronRight } from 'react-feather';

let slidedTheSlider = false;
let maxSteps = 1;

const ProductList = props => {
    const { item, formatMessage } = props;
    const unqId = 'smpb-productlist-' + item.entity_id;
    const [currentStep, setCurrentStep] = useState(0);
    let filterData = { category_id: { eq: '6' } };
    let sortData;
    let pageSize = 12;
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

    const scrollToIndex = index => {
        if (
            data &&
            data.products &&
            data.products.items &&
            data.products.items.length &&
            data.products.items[index]
        ) {
            const elements = document.getElementById(unqId).children;
            const target = elements.item(index);
            target.scrollIntoView({ block: 'nearest', inline: 'start' });
        }
    };
    useEffect(() => {
        if (document.getElementById(unqId)) {
            const ctnWidth = document.getElementById(unqId).offsetWidth;
            let galleryItemWidth;
            if (ctnWidth.children && ctnWidth.children[0])
                galleryItemWidth = ctnWidth.children[0].offsetWidth;
            if (!galleryItemWidth) {
                galleryItemWidth = ctnWidth / 3;
            }
            maxSteps = parseInt(ctnWidth / galleryItemWidth) - 1;
        }
    });

    useEffect(() => {
        if (currentStep === 0) {
            if (!slidedTheSlider) return;
        } else slidedTheSlider = true;
        scrollToIndex(currentStep);
    }, [currentStep]);

    if (
        data &&
        data.products &&
        data.products.items &&
        data.products.items.length &&
        storeConfig
    ) {
        const name = formatMessage({ val: item.name });
        return (
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    overflow: 'hidden'
                }}
                className={classes.smpbProductListWrapper}
            >
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        marginBottom: 15,
                        justifyContent: 'space-between'
                    }}
                >
                    {name}
                </div>
                <div
                    style={{
                        display: 'flex',
                        width: '100%',
                        flexWrap: 'nowrap',
                        overflow: 'auto'
                    }}
                    className={classes.smpbProductListCtn}
                    id={unqId}
                >
                    {data.products.items.map((productItem, indx) => {
                        return (
                            <GalleryItem
                                key={indx}
                                item={productItem}
                                classes={classes}
                                formatMessage={formatMessage}
                                storeConfig={storeConfig}
                            />
                        );
                    })}
                </div>
                <div className={classes.scrollNavCtn}>
                    <div
                        className={currentStep === 0 && classes.navDisabled}
                        onClick={() => {
                            if (currentStep > 0)
                                setCurrentStep(currentStep - 1);
                        }}
                    >
                        <ChevronLeft size={24} />
                    </div>
                    <div
                        className={
                            currentStep >= maxSteps && classes.navDisabled
                        }
                        onClick={() => {
                            if (currentStep < maxSteps)
                                setCurrentStep(currentStep + 1);
                        }}
                    >
                        <ChevronRight size={24} />
                    </div>
                </div>
            </div>
        );
    } else if (loading) {
        return <LoadingIndicator />;
    }
    return '';
};

export default ProductList;
