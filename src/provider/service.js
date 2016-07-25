"use strict";
import _strings from "../strings";

//Create new service
export default function (name, dependencyList, fn) {
    return this.provider(
        name,
        dependencyList,
        fn,
        _strings._service
    );
}
