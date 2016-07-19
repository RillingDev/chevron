"use strict";

export default function (name, dependencyList, fn, type, args) {
    let _this = this;

    if (_this.$c.exists(name)) {
        throw `${_this.name}: error in ${type}: service '${name}' is already defined`;
    } else {
        add(name, dependencyList, type, fn, args);

        return _this;
    }

    //add new service
    function add(name, dependencyList, type, fn, args) {
        let service = _this.container[name] = {
            name,
            type,
            dependencies: dependencyList || [],
            fn,
            initialized: false
        };
        //Add type specific props
        if (type === "factory") {
            service.args = args || [];
        }
    }
}
