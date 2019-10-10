module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        jasmine: {
            customTemplate: {
                src: 'dist/<%= pkg.name %>.js',
                options: {
                    host: 'http://localhost:7999/',
                    specs: 'tests/spec/**/*.js',
                    summary: true,
                    template: 'tests/shortlink.tmpl',
                    vendor: [
                        'http://code.jquery.com/jquery-2.1.1.min.js'
                    ]
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/**/*.js',
                'tests/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        connect: {
            server: {
                options: {
                    port: 7999,
                    keepalive: false
                }
            }
        },
        concat: {
            dist: {
                src: ['src/acceptance.js', 'src/qrcode.js'],
                dest: 'dist/<%= pkg.name %>.js',
            },
            options: {
                banner: "" +
                    "(function (root, factory) {\n" +
                    "    if (typeof define === 'function' && define.amd) {\n" +
                    "        // AMD. Register as an anonymous module.\n" +
                    "        define([], function () {\n" +
                    "            root.Settle = factory();\n" +
                    "            return root.Settle;\n" +
                    "        });\n" +
                    "    } else {\n" +
                    "        // Browser globals\n" +
                    "        root.Settle = factory();\n" +
                    "    }\n" +
                    "}(this, function () {\n" +
                    "    'use strict';\n" +
                    "    var exports = {};\n",

                footer: "return exports;\n}));",
                stripBanners: true,
                process: function (src, filepath) {
                    return src.replace(/^[^]*var exports\s*=\s*{\s*}\s*;([^]+)return exports;[^]+$/m, '$1');
                }
            },
        },
        uglify: {
            options: {
                mangle: true
            },
            build: {
                src: 'dist/<%= pkg.name %>.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        inlineImport: {
            options: {
                extensions: {
                    ".css": "utf8",
                    ".png": "base64",
                    ".woff": "base64"
                },
                useVar: true
            },
            task: {
                src: "dist/settle.acceptance.js"
            }
        }
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks("grunt-inline-import");

    grunt.registerTask('minify', ['concat']);
    grunt.registerTask('test', ['minify', 'connect', 'inlineImport', 'jasmine']);
    grunt.registerTask('build', ['minify', 'connect', 'inlineImport', 'uglify', 'jasmine']);
    grunt.registerTask('default', ['build']);
};
