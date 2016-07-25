"use strict";
import {
    _service
} from "../strings";

//Create new service
export default function (_name, _deps, _fn) {
    return this.provider(
        _name,
        _deps,
        _service,
        _fn
    );
}
