import React from 'react';
import defaultClasses from './FashionableDotPagination.css';

export const SimpleDot = (props) => {
	const { className = '', ...rest } = props || {};

	const newClassName = ['zmdi zmdi-circle', 'simple-grey-dot', className].join(
		' ',
	);

	return <i className={`${newClassName} ${defaultClasses['simple-grey-dot']} ${defaultClasses[className]||''}`} {...rest} />;
};

export const DotWithOrbital = (props) => {
	const { className = '', ...rest } = props || {};
	const newClassName = ['zmdi zmdi-dot-circle', 'orbital-dot', className].join(
		' ',
	);

	return <i className={`${newClassName} ${defaultClasses['orbital-dot']}`} {...rest} />;
};

export const HorizontalBar = (props) => {
	const { className = '', ...rest } = props || {};
	const newClassName = ['small-horizontal-bar', className].join(' ');

	return <i className={`${newClassName} ${defaultClasses['small-horizontal-bar']}`} {...rest} />;
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
    console.log(defaultClasses)


    return (
		<div className={`${defaultClasses['fashionable-pagination-container']}`} style={pagingStyle}>
			<DotWithOrbital />
			<HorizontalBar />
			{pressableBits}
		</div>
	);
};
