import React, { useEffect, useRef, useState } from 'react';
import { FashionableDotPagination } from './FashionableDotPagination';
import {randomString} from "./randomString";
import defaultClasses from './index.css';

export const CarefreeHorizontalScroll = (props) => {
	const { item, children, pagingStyle } = props || {};
	const { name = 'Hello' } = item;
	const numberOfChildren =
		children instanceof Array ? children.length : children ? 1 : 0;

	const unqId = useRef(randomString()).current;

	const [currentIndex, setCurrentIndex] = useState(0);

	const handleScroll = (index) => {
		if (currentIndex !== index) {
			setCurrentIndex(index);
		}
	};

	useEffect(() => {
		const index = currentIndex;
		if (numberOfChildren <= 1) {
			// no where to scroll
		} else if (children[index]) {
			const elements = document.querySelector(
				`.${unqId}.${
                    defaultClasses ['child-container']
                }`,
			).children;
			const target = elements.item(index);
			target.scrollIntoView({ block: 'nearest', inline: 'start' });
		}
	}, [children, currentIndex, numberOfChildren, unqId]);

	return (
		<React.Fragment>
			<div className={defaultClasses['carefree-container']}>
				<div className={defaultClasses['inner-container']}>
					<div className={defaultClasses['title']}>{name}</div>
					<div className={`${unqId} ${defaultClasses['child-container']}`}>{children}</div>
				</div>
				<FashionableDotPagination
					pagingStyle={pagingStyle}
					numberOfPages={numberOfChildren}
					currentIndex={currentIndex}
					onChangeIndex={handleScroll}
				/>
			</div>
		</React.Fragment>
	);
};
