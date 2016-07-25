"use strict";
import _strings from "../strings";

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
    if (type === _strings._factory) {
        service.args = args || [];
    }
}
