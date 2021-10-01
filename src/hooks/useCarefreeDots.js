import {useState, useEffect, useRef} from 'react';


export const useCarefreeDots = (props) => {
    const {children, unqId} = props
    const [numberOfSteps, setNumberOfSteps] = useState(0);

    const childByPosRef = useRef([])

    const numberOfChildren =
        children instanceof Array ? children.length : children ? 1 : 0;

    // calculate the steps
    useEffect(() => {
        // wait for images to render, for better sure, set the min width to each child item
        setTimeout(function () {
            const childContainerEl = document.querySelector(
                `.${unqId}.prev-child-ctn`,
            );
            if (childContainerEl) {
                const elements = Array.from(childContainerEl.children);

                const scrollingWidth = childContainerEl.offsetWidth;

                let itemToMinus = 0;
                let widthFromEnd = 0;
                for (let indx = elements.length - 1; indx >= 0; indx--) {
                    const target = elements[indx];
                    // note: should handle rtl if needed
                    const marginRight = getComputedStyle(target).marginRight
                    childByPosRef.current[elements.length - (1 + indx)] = widthFromEnd;

                    widthFromEnd += parseInt(marginRight) + target.offsetWidth
                    if (widthFromEnd < childContainerEl.offsetWidth) {
                        itemToMinus++;
                    }
                }
                if (itemToMinus < numberOfChildren)
                    setNumberOfSteps(numberOfChildren - itemToMinus + 1);
                else setNumberOfSteps(numberOfChildren);

            }
        }, 1000);
    }, [numberOfChildren, unqId, childByPosRef]);

    return {
        numberOfSteps: numberOfSteps
    }
};
