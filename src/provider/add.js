"use strict";

//add new service/fn
export default function (chev, name, dependencyList, type, fn, args) {
    let service = chev[name] = {
        name,
        type,
        deps: dependencyList || [],
        fn,
        init: false
    };
    //Add type specific props
    if (type === "factory") {
        service.args = args || [];
    }
}
