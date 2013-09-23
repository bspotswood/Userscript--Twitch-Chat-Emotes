module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		template: {
			build: {
				options: {
					data: {
						pkg: '<%= pkg %>'
					}
				},
				files: {
					'script.user.js': ['build/script-concat.js']
				}
			}
		},
		uglify: {
			build: {
				files: {
					'script.min.js': ['script.user.js']
				},
				options: {
					banner: '/*! <%= pkg.userscript.name %> v<%= pkg.version %>, <%= grunt.template.today("yyyy-mm-dd") %>, <%= pkg.homepage %>  */\n'
				}
			}
		},
		concat: {
			build: {
				options: {},
				files: {
					'build/script-concat.js': ['src/userscript-header.js', 'src/header.js', 'src/script.js', 'src/footer.js']
				}
			}
		},
		json_generator: {
			script_paths: {
				dest: 'build/script-paths.json',
				options: [
					'path/to/the/greasemonkey/script.js',
					'path/to/the/chrome/script.js',
					'path/to/the/opera/script.js'
				]
			}
		},
		watch: {
			files: ['src/*', 'package.json'],
			tasks: ['default'],
		}
	});

	// Load plugins.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-json-generator');
	grunt.loadNpmTasks('grunt-template');

	// Tasks.
	grunt.registerTask('default', [
		'concat',
		'template',
		'uglify',
		'copy'
	]);

	grunt.registerTask('init', [
		'json_generator'
	]);

	grunt.registerTask('copy', 'Copy userscript to browsers.', function() {
		if (!grunt.file.exists('build/script-paths.json')) {
			grunt.warn('Unable to find `build/script-paths.json`. Run `grunt init` and fill in the files you want to copy to.');
		}
		var files = grunt.file.readJSON('build/script-paths.json');
		files.forEach(function (file) {
			if (!grunt.file.exists(file)) {
				grunt.log.error('Unable to find `' + file + '`. Please make sure the file path is correct in `build/script-paths.json`.');
				return;
			}
			grunt.file.copy('script.user.js', file);
			grunt.log.ok('Copied `script.user.js` to `' + file + '`.');
		});
	});
};
