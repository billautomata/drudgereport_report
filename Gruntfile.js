module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-express-server')
  grunt.loadNpmTasks('grunt-standard')

  // grunt.registerTask('serve', [ 'browserify', 'express:dev', 'watch'])
  grunt.registerTask('default', ['browserify:main', 'standard:webapp', 'express', 'watch'])

  grunt.initConfig({
   express: {
      options: { },
      dev: {
        options: {
          port: 8000,
          script: './server_classify.js'
        }
      }
    },
    standard: {
      options: {
        format: true,
        force: true
      },
      client_js: {
        src: [
          './public/js/classify_link.js'
        ]
      },
      server_js: {
        src: [
          'server_classify.js'
        ]
      },
      webapp: {
        src: [
          './webapp/*.js', './webapp/**/*.js', './webapp/**/**/*.js'
        ]
      }
    },
    browserify: {
      main: {
        src: 'webapp/main.js',
        dest: 'public/js/build/viz.js',
        files: {
          'public/js/build/viz.js': ['./webapp/*.js', './webapp/**/*.js', './webapp/**/**/*.js' ],
        },
        options: {
          transform: ['brfs'],
          browserifyOptions: {
            debug: false
          }
        }
      }
    },
    //   ng_dashboard: {
    //     src: 'ng-dashboard/main.js',
    //     dest: 'public/js/build/ng-dashboard.js',
    //     files: {
    //       'public/js/build/ng-dashboard.js': [
    //         './ng-dashboard/*.js',
    //         './ng-dashboard/*/*.js',
    //         './ng-dashboard/**/**/*.js' ],
    //     },
    //     options: {
    //       force: true,
    //       transform: ['brfs'],
    //       browserifyOptions: {
    //         debug: true
    //       }
    //     }
    //   }
    // },
    watch: {
      client_js: {
        files: ['./webapp/*.js', './public/*.html' ],
        tasks: ['standard:webapp', 'browserify:main'],
        options: {
          livereload: {
            port: 35729
          }
        },
      },
      // ng_dashboard: {
      //   files: [ './ng-dashboard/*.js',
      //     './ng-dashboard/**/*.js' ],
      //   tasks: ['standard:ng_dashboard', 'browserify:ng_dashboard'],
      //   options: {
      //     force: true,
      //     livereload: {
      //       port: 35729
      //     }
      //   },
      // }
    }
  })
}
