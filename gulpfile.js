var gulp 			= require('gulp'),
	sass 			= require('gulp-sass'),
	browserSync 	= require('browser-sync').create(),
	useref 			= require('gulp-useref'),
	gulpIf 			= require('gulp-if'),
	uglify 			= require('gulp-uglify'),
	imagemin 		= require('gulp-imagemin'),
	cache 			= require('gulp-cache'),
	del 			= require('del'),
	runSequence 	= require('run-sequence'),
	prefix 			= require('gulp-autoprefixer');

//Complie Sass
//outputStyle in gulp-sass has four options: nested, expanded, compact, compressed
gulp.task('sass', function(){
	return gulp.src('app/scss/**/*.scss')
			.pipe(sass({
				outputStyle: 'compressed'
			}).on('error', sass.logError))
			.pipe(prefix('last 10 versions'))
			.pipe(gulp.dest('app/css'))
			.pipe(browserSync.reload({
				stream: true
			}));
});

//Watchers
gulp.task('watch', function(){
	//watching sass files
	gulp.watch('app/scss/**/*.scss', ['sass']);

	//Reload files when saved
	gulp.watch('app/**/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);

	//Other watchers
});

//Concatenate, Minify files - JS/CSS
// gulp.task('useref', function(){
// 	return gulp.src('app/*.html')
// 			.pipe(useref())
// 			.pipe(gulpIf('*.js', uglify()))
// 			.pipe(gulp.dest('dist/js'));
// });

//Clean dist folder
gulp.task('clean:dist', function(){
	return del.sync('dist');
});

// //Optimizing Images
// gulp.task('images', function(){
// 	return gulp.src('app/assets/**/*.+(png|jpg|gif|svg)')
// 			.pipe(cache(imagemin({
// 				// Setting interlaced to true
// 				interlaced: true
// 			})))
// 			.pipe(gulp.dest('dist/assets'));
// });

// //Deleting image cache
// gulp.task('cache:clear', function(callback){
// 	return cache.clearAll(callback);
// });

//Copying fonts
gulp.task('fonts', function(){
	return gulp.src('app/fonts/**/*')
			.pipe(gulp.dest('dist/fonts'));
});

//BrowserSync
gulp.task('browserSync', function(){
	browserSync.init({
		server: {
			baseDir: './app',
			directory: true,
		},
	});
});


//Default - Development Server
gulp.task('default', function(callback) {
	runSequence(['sass', 'browserSync', 'watch'], callback);
});


gulp.task('html-dist', function(){
	return gulp.src('app/**/*.html')
			.pipe(gulp.dest('dist'));
});


gulp.task('sass-dist', function(){
	return gulp.src('app/css/app.css')
			.pipe(gulp.dest('dist/css'));
});

gulp.task('js-dist', function(){
	return gulp.src('app/js/*.js')
			.pipe(uglify())
			.pipe(gulp.dest('dist/js'));
});

gulp.task('asset-dist', function(){
	return gulp.src('app/assets/**/**')
			.pipe(gulp.dest('dist/assets'));
});

gulp.task('favicon-dist',function(){
	return gulp.src('app/*.ico')
			.pipe(gulp.dest('dist'));
});

//Build
gulp.task('build', function(callback) {
	console.log("Building Files");

	runSequence('clean:dist', ['html-dist','sass', 'sass-dist', 'asset-dist', 'fonts'], 'js-dist', 'favicon-dist', callback);
});