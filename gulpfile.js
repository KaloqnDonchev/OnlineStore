const gulp = require('gulp');
const sass = require('gulp-sass');
// const eslint = require('gulp-eslint');

// gulp.task('lintChecker', () => gulp.src(['./*.js', './routes/*.js', './public/scripts/*.js'])
//   .pipe(eslint())
//   .pipe(eslint.format())
//   .pipe(eslint.failAfterError()));

// gulp.task('scssCompiler', () => gulp.src('./scss/style.scss')
//   .pipe(sass().on('error', sass.logError))
//   .pipe(gulp.dest('./public/stylesheets/')));

// gulp.task('scss:watch', () => {
//   gulp.watch('./scss/**/*.scss', ['scssCompiler']);
// });

// gulp.task('lint:watch', () => {
//   gulp.watch('./public/scripts/*.js', ['lintChecker']);
//   gulp.watch('./routes/*.js', ['lintChecker']);
//   gulp.watch('./app.js', ['lintChecker']);
// });

// gulp.task('scss', gulp.series('scssCompiler', 'scss:watch'));
// gulp.task('lint', ['lintChecker', 'lint:watch']);
// gulp.task('default', ['scss', 'lint']);

function scss() {
  // Where should gulp look for the sass files?
  // My .sass files are stored in the styles folder
  // (If you want to use scss files, simply look for *.scss files instead)
  return (
    gulp
      .src('./scss/style.scss')

    // Use sass with the files found, and log any errors
      .pipe(sass())
      .on('error', sass.logError)

    // What is the destination for the compiled file?
      .pipe(gulp.dest('./public/stylesheets/'))
  );
}


function watch() {
  // gulp.watch takes in the location of the files to watch for changes
  // and the name of the function we want to run on change
  gulp.watch('./scss/**/*.scss', scss);
}

const exportObj = {
  watch,
  scss,
};

module.exports = exportObj;
