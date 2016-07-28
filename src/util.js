"use strict";

/**
 * Misc Utility functions
 */
export
/**
 * Iterate fn over array (faster than Array.prototype.forEach)
 * @private
 * @param Array values
 * @param Function iterate fn
 * @return void
 */
let _each = function (arr, fn) {
        for (let i = 0, l = arr.length; i < l; i++) {
            fn(arr[i], i);
        }
    },
    /**
     * Iterate fn over object
     * @private
     * @param Object values
     * @param Function iterate fn
     * @return void
     */
    _eachObject = function (object, fn) {
        let keys = Object.keys(object);

        _each(keys, (key, i) => {
            fn(object[key], key, i);
        });
    };
