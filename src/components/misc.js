let chevron = {
    //v: "0.1.0",
    dependencies: {},
    modules: {},

    module: function (name, dependencies, fn) {
        return chevron.modules[name] = new(class {
            constructor(name, dependencies, fn) {

                this.name = name;
                this.dependencies = chevron.async.loadDependencies(dependencies);

                if (chevron.isDefined(fn)) {
                    fn.call(this, this.dependencies);
                }
            }
        })(name, dependencies, fn);
    },

    /*--------------------------------------------------------------------------*/
    /**
     * Async
     */

    async: {
        loadDependencies: function (list) {
            let result = {};
            chevron.each(list, item => {
                chevron.async.requireDependency(item).then(dependency => {
                    if (!chevron.isDefined(result[item])) {
                        chevron.async.addDependency(item, dependency);
                        result[item] = dependency;
                    }
                });
            });
            return result;
        },
        requireDependency: function (key) {
            return new Promise((resolve, reject) => {
                let result;
                if (result = searchDependency(key)) {
                    resolve(result);
                } else {
                    reject(chevron.log(this.name, "error", `dependency ${key} not found`));
                }
            });

            function searchDependency(key) {
                let result;

                if (chevron.isDefined(chevron.dependencies[key])) {
                    result = chevron.dependencies[key];
                } else if (chevron.modules[key]) {
                    result = chevron.modules[key];
                } else if (chevron.isDefined(window[key])) {
                    result = window[key];
                } else {
                    result = false;
                }

                return result;
            }
        },
        addDependency: function (name, dependency) {
            if (chevron.isDefined(chevron.dependencies[name])) {
                return false;
            } else {
                chevron.dependencies[name] = dependency;
                return true;
            }
        }
    },

    /*--------------------------------------------------------------------------*/
    /**
     * Utility
     */
    each: function (arr, fn) {
        for (let i = 0, l = arr.length; i < l; i++) {
            fn(arr[i], i);
        }
    },
    eachObject: function (object, fn) {
        let keys = Object.keys(object);
        for (let i = 0, l = keys.length; i < l; i++) {
            fn(object[keys[i]], i);
        }
    },

    isDefined: function (val) {
        return typeof val !== "undefined";
    },
    log(name, type, msg) {
        let str = `Chevron: ${type} in module ${name}: ${msg}`;
        if (type === "error") {
            throw str;
        } else {
            console.log(str);
        }
    }

};
