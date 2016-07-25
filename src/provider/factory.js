"use strict";
import {
    _factory
} from "../strings";

//Create new factory
export default function (name, deps, Constructor, args) {
    return this.provider(
        name,
        deps,
        _factory,
        Constructor,
        args
    );
}
