"use strict";
import _strings from "../strings";

//Create new factory
export default function (name, dependencyList, Constructor, args) {
    return this.provider(
        name,
        dependencyList,
        Constructor,
        _strings._factory,
        args
    );
}
