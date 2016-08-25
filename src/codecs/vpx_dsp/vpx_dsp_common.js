'use strict';
module.exports = Object.freeze({
    
    VPXMIN: function (x, y) {
        return (((x) < (y)) ? (x) : (y));
    },

    VPXMAX: function (x, y) {
        return (((x) > (y)) ? (x) : (y));
    },

    clip_pixel: function (val) {
        return (val > 255) ? 255 : (val < 0) ? 0 : val;
    },

    clamp: function (value, low, high) {
        return value < low ? low : (value > high ? high : value);
    },

    fclamp: function (value, low, high) {
        return value < low ? low : (value > high ? high : value);
    },

    clip_pixel_highbd: function (val, bd) {
        switch (bd) {
            case 10:
                return clamp(val, 0, 1023);
            case 12:
                return clamp(val, 0, 4095);
            default:
                return clamp(val, 0, 255);

        }
    }

});