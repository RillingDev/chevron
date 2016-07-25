"use strict";
import _factory from "../strings/factory";

//Create new factory
export default function (_name, _deps, _Constructor, _args) {
    return this.provider(
        _name,
        _deps,
        _factory,
        _Constructor,
        _args
    );
}
