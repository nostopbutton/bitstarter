'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down: 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders: 'test/spec/**/*.js'

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        public_dist: 'dist/public',
        express_dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            coffee: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
                tasks: ['coffee:dist']
            },
            coffeeTest: {
                files: ['test/spec/{,*/}*.coffee'],
                tasks: ['coffee:test']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            },
            livereload: {
                files: [
                    '<%= yeoman.app %>/*.html',
                    '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
                    '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
                    '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                tasks: ['livereload']
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            },
            test: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, 'test')
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'dist')
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.express_dist %>/*',
                        '!<%= yeoman.express_dist %>/.git*'
                    ]
                }]
            },
            quick_dist: {
              files: [{
                dot: true,
                src: [
                  '.tmp',
                  '<%= yeoman.express_dist %>/*',
                  '!<%= yeoman.express_dist %>/.git*',
                  '!<%= yeoman.express_dist %>/node_modules'
                ]
              }]
            },
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>/index.html']
                }
            }
        },
        karma: {
          unit: {
            configFile: 'config/karma.unit.conf.js',
            singleRun: true
          }
        },
        coffee: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/scripts',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/scripts',
                    ext: '.js'
                }]
            },
            test: {
                files: [{
                    expand: true,
                    cwd: 'test/spec',
                    src: '{,*/}*.coffee',
                    dest: '.tmp/spec',
                    ext: '.js'
                }]
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '.tmp/styles',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: 'app/components',
                relativeAssets: true
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },
        // not used since Uglify task does concat,
        // but still available if needed
        /*concat: {
            dist: {}
        },*/
        // not enabled since usemin task does concat and uglify
        // check index.html to edit your build targets
        // enable this task if you prefer defining your build targets here
        /*uglify: {
            dist: {}
        },*/
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.public_dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.public_dist %>/styles/{,*/}*.css',
                        '<%= yeoman.public_dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= yeoman.public_dist %>/styles/fonts/{,*/}*'
                    ]
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.public_dist %>'
            }
        },
        usemin: {
            html: ['<%= yeoman.public_dist %>/{,*/}*.html'],
            css: ['<%= yeoman.public_dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.public_dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.public_dist %>/images'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.public_dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.public_dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.public_dist %>'
                }]
            }
        },
        cdnify: {
          dist: {
            html: ['<%= yeoman.public_dist %>/*.html']
          }
        },
        ngmin: {
          dist: {
            files: [{
              expand: true,
              cwd: '<%= yeoman.public_dist %>/scripts',
              src: '*.js',
              dest: '<%= yeoman.public_dist %>/scripts'
            }]
          }
        },
        // https://github.com/ahutchings/grunt-install-dependencies
        'install-dependencies': {
          options: {
            cwd: '<%= yeoman.express_dist %>'
            , stdout: true
            , stderr: true
            , failOnError: true
          }
        },
        // Put files not handled in other tasks here
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.public_dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'components/**/*',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/**/*'
                        , '*.html'
                    ]
                },
                {
                  expand: true,
                  dest: '<%= yeoman.express_dist %>',
                  cwd: 'heroku',
                  src: ['**/*', '.gitignore'],
                  rename: function (dest, src) {
                    var path = require('path');
                    if (src === 'distpackage.json') {
                      return path.join(dest, 'package.json');
                    }
                    return path.join(dest, src);
                  }
                }]
            },
            quick_dist: {
              files: [{
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>',
                dest: '<%= yeoman.public_dist %>',
                src: [
                  '*.{ico,txt}',
                  '.htaccess',
                  'components/**/*',
                  'referenceData/**/*',
                  'images/{,*/}*.*',
                  'styles/fonts/*'
                  , '*.html', 'views/*.html', 'template/{,*/}*.html'
                  , 'scripts/{,*/}*.*'
                ]
              },
                {
                  expand: true,
                  dot: true,
                  dest: '<%= yeoman.express_dist %>',
                  cwd: 'heroku',
                  src: ['**/*', '.gitignore'],
                  rename: function (dest, src) {
                    var path = require('path');
                    if (src === 'distpackage.json') {
                      return path.join(dest, 'package.json');
                    }
                    return path.join(dest, src);
                  }
                }]
            }
        },
        concurrent: {
            server: [
                'coffee:dist',
                'compass:server'
            ],
            test: [
                'coffee',
                'compass'
            ],
            dist: [
                'coffee',
                'compass:dist',
                'imagemin',
                'svgmin',
                'htmlmin'
            ],
            quick_dist: [
              'coffee',
              'compass:dist'
            ]
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'livereload-start',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'connect:test',
        'mocha'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'concat',// SWAPPED
        'cssmin',// SWAPPED
//        'uglify',
        'copy',
//      'cdnify',
      'ngmin',
        'rev',
        'usemin'
      , 'install-dependencies'
    ]);

    grunt.registerTask('quick', [
      'clean:quick_dist',
      'useminPrepare',
      'concurrent:quick_dist',
      'concat',
      'cssmin',
      'copy:quick_dist',
      'cdnify',
      'ngmin',
  //    'uglify', ??
      'rev',
      'usemin'
      , 'install-dependencies'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};
