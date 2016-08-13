"use strict";

module.exports = function(grunt) {
    require("time-grunt")(grunt);
    require("jit-grunt")(grunt, {});

    grunt.initConfig({
        watch: {
            js: {
                files: [
                    "src/**/*.js"
                ],
                tasks: [
                    "exec"
                ]
            },
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        "dist/{,*/}*"
                    ]
                }]
            }
        },

        uglify: {
            main: {
                files: {
                    "dist/chevron.min.js": "dist/chevron.js",
                },
                options: {
                    compress: {
                        drop_console: true,
                        screw_ie8: true,
                        //unsafe: true,
                        //unsafe_comps: true*
                    }
                }
            }
        },

        babel: {
            options: {
                sourceMap: true,
                presets: ["es2015"],
                plugins: []
            },
            dist: {
                files: {
                    "dist/chevron.amd.js": "dist/es6/chevron.amd.js",
                    "dist/chevron.common.js": "dist/es6/chevron.common.js",
                    "dist/chevron.es.js": "dist/es6/chevron.es.js",
                    "dist/chevron.js": "dist/es6/chevron.js"
                }
            }
        },

        exec: {
            rollup: {
                cmd: "rollup -c"
            }
        }

    });

    grunt.registerTask("build", [
        "clean:dist",
        "exec",
    ]);

    grunt.registerTask("dist", [
        "build",
        "babel",
        "uglify",
    ]);

    grunt.registerTask("default", [
        "dist"
    ]);

};
