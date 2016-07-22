"use strict";
import util from "./util";

export default function (name) {
    let _this = this,
        accessedService = this.chev[name];

    //Check if accessed service is registered
    if (accessedService) {
        return prepare(accessedService).fn;
    } else {
        throw `${_this.name}: error accessing ${name}: '${name}' is not defined`;
    }

    function prepare(service) {
        let list = {};

        recurseDependencies(
            service.deps,
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
            let service = _this.chev[name];
            if (service) {

                if (service.deps.length > 0) {
                    //recurse
                    recurseDependencies(service.deps, fn, error);
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
            if (service.deps.includes(key)) {
                bundle.push(item);
            }
        });

        if (!service.init) {
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

        service.init = true;
        return service;
    }

}
