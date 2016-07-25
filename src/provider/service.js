"use strict";
import {
    _service
} from "../strings";

//Create new service
export default function (name, deps, fn) {
    return this.provider(
        name,
        deps,
        _service,
        fn
    );
}
