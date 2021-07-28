import React from 'react';
import {mergeClasses} from "@magento/venia-ui/lib/classify";
import defaultClasses from "./scroll.css";
import LoadingIndicator from "@magento/venia-ui/lib/components/LoadingIndicator";
import {CarefreeHorizontalScroll} from "../CarefreeHorizontalScroll/CarefreeHorizontalScroll";
import {useQuery} from "@apollo/client";
import {GET_MEGA_MENU} from "./megaMenu.gql";
import {recursiveFindCate} from "./index";
import {Link} from "@magento/venia-drivers";

const imageStyle = {
    display: 'block',
    margin: '10px auto',
    width: '100%',
};

export const CategoryScroll = (props) => {
    const {item} = props;

    const {data, loading} = useQuery(GET_MEGA_MENU);
    console.log('kek', data)
    const classes = mergeClasses(defaultClasses, props.classes);
    const {dataParsed} = item;

    if (
        item &&
        item.dataParsed &&
        item.dataParsed.openCategoryProducts &&
        data &&
        data.categoryList &&
        data.categoryList[0] &&
        data.categoryList[0].children &&
        data.categoryList[0].children.length
    ) {
        const rootCate = data.categoryList[0];
        const classes = mergeClasses(defaultClasses, props.classes);
        const idsToFind = item.dataParsed.openCategoryProducts
            ? JSON.parse(item.dataParsed.openCategoryProducts) : []
        const validIds = idsToFind.map(x => parseInt(x)).map(x => recursiveFindCate(rootCate.children, x))
            .filter(x => !!x);

        const content = validIds.map((x, i) => {
            // const imgLink = '/pub/media/catalog/product/cache/a3e2ee71b82106c18dca4419b53b8e60/v/a/va01-rn_main.jpg?auto=webp&format=pjpg&width=840&height=375&fit=cover'

            const imgLink = dataParsed.image || x.image || ''
            return (
                <Link
                    className={classes.root}
                    to={`${x.url_path || ''}${x.url_suffix || '.html'}`}
                    style={{width: '100%'}}
                    key={i.toString()}
                >
                    {imgLink ? (
                        <img
                            src={imgLink}
                            alt={x.name}
                            style={imageStyle}
                        />
                    ) : (
                        ''
                    )}
                    <div className={classes.cate_name}>{x.name}</div>
                </Link>
            );
        })

        return (
            <CarefreeHorizontalScroll
                item={item}
                pagingStyle={{
                    marginTop: 5
                }}
            >
                {content}
            </CarefreeHorizontalScroll>
        )

    } else if (loading) {
        return <LoadingIndicator/>
    }
    return ''

};

