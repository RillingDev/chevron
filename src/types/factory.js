"use strict";


/**
 * Creates method entry for factory
 *
 * @private
 * @returns Returns void
 */
export default function() {
    this.extend("factory", function(service, bundle) {
        //First value gets ignored by calling 'new' like this, so we need to fill it
        bundle.unshift(0);

        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        service.fn = new(Function.prototype.bind.apply(service.fn, bundle));

        return service;
    });
}
