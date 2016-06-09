"use strict";

module.exports = function (grunt) {
    require("time-grunt")(grunt);
    require("jit-grunt")(grunt, {});


    grunt.initConfig({
        watch: {
            js: {
                files: [
                    "src/{,*/}*.js"
                ],
                tasks: [
                    "copy:dist",
                    "babel"
                ]
            },
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc",
                reporter: require("jshint-stylish")
            },
            files: {
                src: [
                    "src/{,*/}.js"
                ]
            },
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        "dist/{,*/}*",
                        ".tmp/{,*/}*"
                    ]
                }]
            }
        },

        uglify: {
            main: {
                files: {
                    ("dist/"+grunt.custom.name+"-es5.min.js": ".tmp/chevron-es5.js")
                },
                options: {
                    compress: {
                        drop_console: true,
                        screw_ie8: true
                    }
                }
            }
        },

        copy: {
            build: {
                files: {
                    ".tmp/chevron.js": "src/chevron.js",
                }
            },
            dist: {
                files: {
                    "dist/chevron.js": ".tmp/chevron.js",
                    "dist/chevron-es5.js": ".tmp/chevron-es5.js"
                }
            }
        },

        babel: {
            options: {
                sourceMap: true,
                presets: ["es2015"]
            },
            dist: {
                files: {
                    ".tmp/chevron-es5.js": ".tmp/chevron.js"
                }
            }
        },

    });

    grunt.registerTask("build", [
        "clean:dist",
        "copy:build",
    ]);

    grunt.registerTask("test", [
        "build",
        "jshint"
    ]);

    grunt.registerTask("dist", [
        "build",
        "babel:dist",
        "uglify:main",
        "copy:dist"
    ]);

    grunt.registerTask("default", [
        "jshint",
        "dist"
    ]);

};
