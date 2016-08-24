'use strict';

function VPXMIN(x, y) {
    return (((x) < (y)) ? (x) : (y));
}

function VPXMAX(x, y) {
    return (((x) > (y)) ? (x) : (y));
}


function clip_pixel(val) {
    return (val > 255) ? 255 : (val < 0) ? 0 : val;
}

function clamp(value, low, high) {
    return value < low ? low : (value > high ? high : value);
}

function fclamp(value, low, high) {
    return value < low ? low : (value > high ? high : value);
}


function clip_pixel_highbd(val, bd) {
    switch (bd) {
        case 10:
            return clamp(val, 0, 1023);
        case 12:
            return clamp(val, 0, 4095);
        default:
            return clamp(val, 0, 255);

    }
}
