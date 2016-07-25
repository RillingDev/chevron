"use strict";

//add new service/fn
export default function (chev, _name, dependencyList, _type, _fn, _args) {
    //External applications should not try to access container props as the keys change between min/normal version; stick to cv.access()
    let service = chev[_name] = {
        _name,
        _type,
        _deps: dependencyList || [],
        _args,
        _fn,
        _init: false
    };
}
