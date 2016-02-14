module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            files: {
                src: 'abigimage.jquery.js',
                dest: 'abigimage.jquery.min.js'
            }
        },

        cssmin: {
            files: {
                src: 'abigimage.jquery.css',
                dest: 'abigimage.jquery.min.css'
            }
        },

        usebanner: {
            options: {
                position: 'top',
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>) */\n',
                linebreak: false
            },
            files: {
                src: [
                    'abigimage.jquery.min.js',
                    'abigimage.jquery.min.css'
                ]
            }
        },

        file_info: {
            source_files: {
                src: [
                    'abigimage.jquery.js',
                    'abigimage.jquery.min.js',
                    'abigimage.jquery.css',
                    'abigimage.jquery.min.css'
                ],
                options: {
                    stdout: false,
                    inject: {
                        dest: 'README.md',
                        text: '* [abigimage.jquery.js](abigimage.jquery.js) ' +
                            '({{= sizeText(size(src[0])) }}) ' +
                            '[min](abigimage.jquery.min.js) ' +
                            '({{= sizeText(size(src[1])) }}, gzipped {{= sizeText(gzipSize(src[1])) }})' +
                            '\n* [abigimage.jquery.css](abigimage.jquery.css) ' +
                            '({{= sizeText(size(src[2])) }}) ' +
                            '[min](abigimage.jquery.min.css) ' +
                            '({{= sizeText(size(src[3])) }}, gzipped {{= sizeText(gzipSize(src[3])) }})'
                    }
                }
            }
        },

        replace: {
            readme: {
                options: {
                    patterns: [
                        {
                            match: /version \*\*.*\*\* \(.*\)/,
                            replacement: 'version **<%= pkg.version %>** (<%= grunt.template.today("yyyy-mm-dd") %>)'
                        }
                    ]
                },
                files: [
                    {
                        src: 'README.md',
                        dest: 'README.md'
                    }
                ]
            },
            example: {
                options: {
                    patterns: [
                        {
                            match: /<!-- Example -->/,
                            replacement: '<%= grunt.file.read("tpl/example.tpl.html") %>'
                        }
                    ]
                },
                files: [
                    {
                        src: 'index.html',
                        dest: 'index.html'
                    }
                ]
            }
        },

        markdown: {
            index: {
                options: {
                    template: 'tpl/index.tpl.html',
                    markdownOptions: {
                        gfm: true,
                        highlight: 'manual',
                        langPrefix: 'hljs lang-'
                    }
                },
                files: [
                    {
                        src: 'README.md',
                        dest: 'index.html'
                    }
                ]
            }
        },

        clean: [
            "abigimage.jquery.min.js.gz"
        ],

        bump: {
            options: {
                pushTo: 'origin',
                commitFiles: ['.'],
                updateConfigs: ['pkg']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-file-info');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-npm');
    grunt.loadNpmTasks('grunt-banner');

    grunt.registerTask('default', [
        'bump-only:prerelease',
        'build'
    ]);

    grunt.registerTask('build', [
        'uglify',
        'cssmin',
        'usebanner',
        'file_info',
        'replace:readme',
        'markdown',
        'replace:example',
        'clean'
    ]);

    grunt.registerTask('release', function (type) {
        grunt.task.run('bump-only:' + (type || 'patch'));
        grunt.task.run('build');
        grunt.task.run('bump-commit');
        grunt.task.run('npm-publish');
    });

};
