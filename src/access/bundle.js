"use strict";
import util from "../util";
import initialize from "./initialize";

export default function (service, list) {
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
