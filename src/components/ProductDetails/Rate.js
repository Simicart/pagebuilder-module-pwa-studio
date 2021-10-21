import React from 'react';
import PropTypes from 'prop-types';

const FiveStars = props => {
    const { style } = props;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            style={style}
            className={props.className}
            viewBox="0 0 287.308 49.733"
        >
            <title>5stars</title>
            <polygon points="26.146 38.489 9.987 49.733 15.688 30.89 0 18.996 19.683 18.595 26.146 0 32.61 18.595 52.293 18.996 36.605 30.89 42.306 49.733 26.146 38.489" />
            <polygon points="84.9 38.489 68.741 49.733 74.442 30.89 58.754 18.996 78.437 18.595 84.9 0 91.364 18.595 111.047 18.996 95.359 30.89 101.06 49.733 84.9 38.489" />
            <polygon points="143.654 38.489 127.495 49.733 133.196 30.89 117.508 18.996 137.19 18.595 143.654 0 150.118 18.595 169.801 18.996 154.113 30.89 159.814 49.733 143.654 38.489" />
            <polygon points="202.408 38.489 186.249 49.733 191.95 30.89 176.262 18.996 195.944 18.595 202.408 0 208.872 18.595 228.554 18.996 212.867 30.89 218.567 49.733 202.408 38.489" />
            <polygon points="261.162 38.489 245.003 49.733 250.703 30.89 235.016 18.996 254.698 18.595 261.162 0 267.626 18.595 287.308 18.996 271.621 30.89 277.321 49.733 261.162 38.489" />
        </svg>
    );
};

const Rate = props => {
    const { rate, fillColor, backgroundColor, size, classes } = props;
    const height = size;
    const width = 5 * height;
    const activeStyle = {
        height: size,
        width: rate + '%',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0
    };

    return (
        <div
            className={`${classes['static-rate']} static-rate`}
            style={{ width: width, height: height, position: 'relative' }}
        >
            <FiveStars
                style={{
                    width: width,
                    height: height,
                    fill: fillColor ? fillColor : '#e0e0e0'
                }}
            />
            <div
                className={`${
                    classes['static-rate-active']
                } static-rate-active`}
                style={activeStyle}
            >
                <FiveStars
                    style={{
                        width: width,
                        height: height,
                        fill: backgroundColor
                            ? backgroundColor
                            : 'rgb(185, 28, 28)'
                    }}
                />
            </div>
        </div>
    );
};

Rate.defaultProps = {
    rate: 0,
    size: 15,
    classes: {}
};

Rate.propTypes = {
    rate: PropTypes.number,
    size: PropTypes.number,
    classes: PropTypes.object
};

export default Rate;
