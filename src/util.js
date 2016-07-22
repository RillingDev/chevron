"use strict";

export default {
    //Iterate
    each: function (arr, fn) {
        for (let i = 0, l = arr.length; i < l; i++) {
            fn(arr[i], i);
        }
    },
    eachObject: function (object, fn) {
        let keys = Object.keys(object);

        for (let i = 0, l = keys.length; i < l; i++) {
            fn(object[keys[i]], keys[i], i);
        }
    }
};
