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

	const pressableBits = [...Array(numberOfPages).keys()].map((x) => {
		const onChangeIndex = () => _onChangeIndex(x);
		return (
			<SimpleDot
				key={x.toString()}
				className={x === currentIndex ? 'simple-grey-dot-active' : ''}
				onClick={onChangeIndex}
			/>
		);
	});
    return (
		<div className={generateClass(defaultClasses, '', 'fashionable-pagination-container')} style={pagingStyle}>
			<DotWithOrbital />
			<HorizontalBar />
			{pressableBits}
		</div>
	);
};
