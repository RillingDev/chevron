"use strict";

export default function (name, dependencyList, Constructor, args) {
    return this.provider(
        name,
        dependencyList,
        Constructor,
        "factory",
        args
    );
}
