"use strict";

const construct = function ($map, _module, cf) {
    const dependencies = [];
    let constructedModule;

    _module.deps.forEach(depName => {
        const dependency = $map.get(depName);

        if (dependency) {
            dependencies.push(dependency.init === true ? dependency.fn : dependency.construct());
        } else {
            throw new Error("missing " + depName);
        }
    });

    constructedModule = cf(_module, dependencies);
    _module.init = true;

    return constructedModule.fn;
};

export default construct;
