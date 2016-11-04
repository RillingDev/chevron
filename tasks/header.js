"use strict";

module.exports = function(packageJson) {
    return `/**
 * ${packageJson.namespace.module} ${packageJson.version}
 * Author: ${packageJson.author}
 * Repository: ${packageJson.repository.url}
 */

`;
};
