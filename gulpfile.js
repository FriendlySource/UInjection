(function (config) {
    // DEFAULT TASKS
    const defaults = ['compile-styles', 'compile-scripts'];

    // DEPENDENCIES
    const prefixer = require('autoprefixer-stylus');
    const historyApiFallback = require('connect-history-api-fallback');
    const browserSync = require('browser-sync').create();
    const gulp = require('gulp');
    const plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*'],
        replaceString: /\bgulp[\-.]/
    });

    if (config.common.environment !== 'production') {
        defaults.push('watch-styles');
        defaults.push('watch-scripts');
        defaults.push('watch-html');
        defaults.push('browser-sync');
    }

    // COMPILE STYLES
    gulp.task('compile-styles', () => {
        gulp.src(`${config.style.src.path}${config.style.src.name}.${config.style.src.extension}`)
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.stylus({
                compress: JSON.parse(config.style.build.minify),
                use: [prefixer()]
            }).on('error', function(error) {
                console.error(error.message);

                this.emit('end');
            }))
            .pipe(plugins.sourcemaps.write(config.common.root))
            .pipe(gulp.dest(config.style.build.path))
            .pipe(browserSync.stream())
    });

    // COMPILE SCRIPTS
    gulp.task('compile-scripts', () => {
        gulp.src([`${config.script.src.path}**/*.${config.script.src.extension}`, `${config.script.src.path}**/*._${config.script.src.extension}`])
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.concat(`${config.script.build.name}.${config.script.build.extension}`))
            .pipe(plugins.sourcemaps.write(config.common.root))
            .pipe(gulp.dest(config.script.build.path))
            .pipe(browserSync.stream())
    });

    // WATCH STYLES
    gulp.task('watch-styles', () => {
        gulp.watch(`${config.style.src.path}**/*.${config.style.src.extension}`, ['compile-styles']);
    });

    // WATCH HTML
    gulp.task('watch-html', () => {
        gulp.watch(`${config.common.build.path.base}**/*.html`)
            .on('change', browserSync.reload);
    });

    // WATCH SCRIPTS
    gulp.task('watch-scripts', () => {
        gulp.watch(`${config.script.src.path}**/*.${config.script.src.extension}`, ['compile-scripts']);
    });
    
    // BROWSER SYNC
    gulp.task('browser-sync', () => {
        browserSync.init({
	        server: {
	            baseDir: config.common.build.path.base,
	            middleware: [ historyApiFallback() ]
	        }
	    });
    });

    gulp.task('default', defaults);
} (require('./gulpfile.config.json')));