import React, { useEffect } from 'react';
import { PageBuilderComponent } from 'simi-pagebuilder-react';

const smRemoveMaxWidthOnMain = () => {
    try {
        if (document.getElementsByTagName('header')[0])
            document.getElementsByTagName(
                'header'
            )[0].nextSibling.style.maxWidth = 'unset';
    } catch (err) {
        console.warn(err);
    }
};

const HOPageBuilderComponent = props => {
    useEffect(() => {
        smRemoveMaxWidthOnMain();
        return () => {
            try {
                //var(--venia-global-maxWidth);
                if (document.getElementsByTagName('header')[0])
                    document.getElementsByTagName(
                        'header'
                    )[0].nextSibling.style.maxWidth = '1440px';
            } catch (err) {
                console.warn(err);
            }
        };
    }, []);
    return <PageBuilderComponent {...props} />;
};

export default HOPageBuilderComponent;
