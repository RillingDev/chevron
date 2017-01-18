"use strict";

const construct = function ($map, _module, cf) {
    const dependencies = [];

    //Collects dependencies
    _module.deps.forEach(depName => {
        const dependency = $map.get(depName);

        if (dependency) {
            dependencies.push(dependency.rdy ? dependency.fn : dependency.init());
        } else {
            throw new Error(`Missing '${depName}'`);
        }
    });

    _module.fn = cf(_module.fn, dependencies);
    _module.rdy = true;

    return _module.fn;
};

export default construct;
