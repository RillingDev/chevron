"use strict";
import _strings from "../strings";

//add new service/fn
export default function (chev, _name, dependencyList, _type, _fn, args) {
    //External applications should not try to access container props as the keky change between min/normal version; stick to cv.access()
    let service = chev[_name] = {
        _name,
        _type,
        _deps: dependencyList || [],
        _fn,
        _init: false
    };
    //Add type specific props
    if (_type === _strings._factory) {
        service._args = args || [];
    }
}
