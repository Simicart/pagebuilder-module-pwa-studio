import React from 'react';
import defaultClasses from './FashionableDotPagination.css';
import {generateClass} from "../../utils/generateClass";

export const SimpleDot = (props) => {
	const { className = '', ...rest } = props || {};
	const newClass = generateClass(defaultClasses, 'zmdi zmdi-circle','simple-grey-dot', className)

	return <i className={newClass} {...rest} />;
};

export const DotWithOrbital = (props) => {
	const { className = '', ...rest } = props || {};
	const newClass = generateClass(defaultClasses, 'zmdi zmdi-dot-circle', 'orbital-dot', className);

	return <i className={newClass} {...rest} />;
};

export const HorizontalBar = (props) => {
	const { className = '', ...rest } = props || {};
	const newClassName = generateClass(defaultClasses, '','small-horizontal-bar', className)

	return <i className={newClassName} {...rest} />;
};

export const FashionableDotPagination = (props) => {
	const {
		numberOfPages = 0,
		currentIndex = 0,
		onChangeIndex: _onChangeIndex,
		pagingStyle = {},
	} = props || {};

    const content = [...Array(numberOfPages).keys()].map((x) => {
        const onChangeIndex = () => _onChangeIndex(x);
        if (currentIndex === x) {
            if (currentIndex === 0) {
                return (
                    <React.Fragment>
                        <DotWithOrbital />
                        <HorizontalBar />
                    </React.Fragment>
                );
            } else if (currentIndex === numberOfPages - 1) {
                return (
                    <React.Fragment>
                        <HorizontalBar />
                        <DotWithOrbital />
                    </React.Fragment>
                );
            } else {
                return (
                    <React.Fragment>
                        <HorizontalBar />
                        <DotWithOrbital />
                        <HorizontalBar />
                    </React.Fragment>
                );
            }
        } else {
            return (
                <SimpleDot
                    key={x.toString()}
                    className={x === currentIndex ? 'active' : ''}
                    onClick={onChangeIndex}
                />
            );
        }
    });

    if (numberOfPages === 0) {
        return '';
    }

    const newClass = generateClass(defaultClasses, '','fashionable-pagination-container')


    return (
        <div className={newClass} style={pagingStyle}>
            {content}
        </div>
    );
};
