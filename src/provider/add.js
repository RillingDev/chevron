"use strict";

//add new service/fn
export default function (name, deps, type, fn, args) {
    this.chev[name] = {
        name,
        type,
        deps,
        args: args || [],
        fn,
        init: false
    };
}
