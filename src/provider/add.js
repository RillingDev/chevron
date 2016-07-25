"use strict";

//add new service/fn
export default function (_name, _deps, _type, _fn, _args) {
    //External applications should not try to access container props as the keys change between min/normal version; stick to cv.access()
    this.chev[_name] = {
        _name,
        _type,
        _deps,
        _args,
        _fn,
        _init: false
    };
}
