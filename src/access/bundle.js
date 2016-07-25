"use strict";
import util from "../util";
import initialize from "./initialize";

//collect dependencies from string, and initialize them if needed
export default function (service, list) {
    let bundle = [];

    util.eachObject(list, (item, key) => {
        if (service._deps.includes(key)) {
            bundle.push(item);
        }
    });

    if (!service._init) {
        return initialize(service, Array.from(bundle));
    } else {
        return service;
    }

}
