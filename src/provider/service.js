"use strict";

export default function (name, dependencyList, fn) {
    return this.provider(
        name,
        dependencyList,
        fn,
        "service"
    );
}
