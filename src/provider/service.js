"use strict";
import _service from "../strings/service";

//Create new service
export default function (name, dependencyList, fn) {
    return this.provider(
        name,
        dependencyList,
        fn,
        _service
    );
}
