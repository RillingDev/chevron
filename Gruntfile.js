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
                    "dist/chevron-es5.min.js": ".tmp/chevron-es5.js",
                    "dist/chevron-lite-es5.min.js": ".tmp/chevron-lite-es5.js"
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
                    "dist/chevron-es5.js": ".tmp/chevron-es5.js",
                    "dist/chevron-lite.js": ".tmp/chevron-lite.js",
                    "dist/chevron-lite-es5.js": ".tmp/chevron-lite-es5.js"
                }
            }
        },

        babel: {
            options: {
                sourceMap: true,
                presets: ["es2015"],
                plugins: ["array-includes"]
            },
            dist: {
                files: {
                    ".tmp/chevron-es5.js": ".tmp/chevron.js",
                    ".tmp/chevron-lite-es5.js": ".tmp/chevron-lite.js"
                }
            }
        },

        toggleComments: {
            customOptions: {
                options: {
                    padding: 4,
                    removeCommands: true
                },
                files: {
                    ".tmp/chevron-lite.js": "src/chevron.js"
                }
            }
        }

    });
    grunt.loadNpmTasks("grunt-comment-toggler");

    grunt.registerTask("build", [
        "clean:dist",
        "copy:build",
        "toggleComments"
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
