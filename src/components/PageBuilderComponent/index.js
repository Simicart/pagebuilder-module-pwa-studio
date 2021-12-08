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
    
    return (
        <div
            style={{
                fontFamily: `"Poppins", Helvetica, Arial, sans-serif`,
                fontSize: '14px',
                lineHeight: 1.5
            }}
        >
            <style>
                @import
                url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            </style>
            <PageBuilderComponent {...props} />
        </div>
    );
};

export default HOPageBuilderComponent;
