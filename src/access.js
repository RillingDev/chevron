"use strict";
import util from "./util";

export default function (name) {
    let _this = this;

    //Check if accessed service is registered
    if (_this.$c.exists(name)) {
        return prepare(_this.$c.get(name)).fn;
    } else {
        throw `${_this.name}: error accessing ${name}: '${name}' is not defined`;
    }

    function prepare(service) {
        let list = {};

        recurseDependencies(
            service.dependencies,
            dependency => {
                list[dependency.name] = bundle(dependency, list).fn;
            },
            name => {
                throw `${_this.name}: error in ${service.name}: dependency '${name}' is missing`;
            }
        );

        return bundle(service, list);
    }
    //Iterate deps
    function recurseDependencies(dependencyList, fn, error) {
        util.each(dependencyList, name => {
            if (_this.$c.exists(name)) {
                let service = _this.$c.get(name);

                if (service.dependencies.length > 0) {
                    //recurse
                    recurseDependencies(service.dependencies, fn, error);
                }
                fn(service);
            } else {
                error(name);
            }
        });
    }

    function bundle(service, list) {
        let bundle = [];

        util.eachObject(list, (item, key) => {
            if (service.dependencies.includes(key)) {
                bundle.push(item);
            }
        });

        if (!service.initialized) {
            return initialize(service, Array.from(bundle));
        } else {
            return service;
        }
    }

    //construct service/factory
    function initialize(service, bundle) {
        if (service.type === "service") {
            let serviceFn = service.fn;

            service.fn = function () {
                //Chevron service function wrapper
                return serviceFn.apply(null,
                    Array.from(bundle.concat(Array.from(arguments)))
                );
            };
        } else {
            bundle = bundle.concat(service.args);
            bundle.unshift(null);
            //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
            service.fn = new(Function.prototype.bind.apply(service.fn, bundle));
        }

        service.initialized = true;
        return service;
    }
}
