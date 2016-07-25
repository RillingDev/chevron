"use strict";
import _factory from "../strings/factory";

//Create new factory
export default function (name, dependencyList, Constructor, args) {
    return this.provider(
        name,
        dependencyList,
        Constructor,
        _factory,
        args
    );
}
