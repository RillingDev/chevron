"use strict";

const construct = function ($map, _module, cf) {
    const dependencies = [];
    let constructedModule;

    //Collects dependencies
    _module.deps.forEach(depName => {
        const dependency = $map.get(depName);

        if (dependency) {
            dependencies.push(dependency.rdy ? dependency.fn : dependency.init());
        } else {
            throw new Error(`missing '${depName}'`);
        }
    });

    constructedModule = cf(_module, dependencies);
    _module.rdy = true;

    return constructedModule.fn;
};

export default construct;
