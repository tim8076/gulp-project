const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync').create();
const minimist = require('minimist');
// const plumber = require('gulp-plumber');
// const sourcemaps = require('gulp-sourcemaps');
// const babel = require('gulp-babel');
// const concat = require('gulp-concat');
// const postcss = require('gulp-postcss');

const envOption = {
  string: 'env',
  default: { env: 'dev' }
}
const options = minimist(process.argv.slice(2), envOption)

gulp.task('sass', function (){
  var plugins = [
    autoprefixer(),
  ];

  return gulp.src('./source/scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(sass({
      includePaths: ['./node_modules/bootstrap/scss']
    }).on('error', sass.logError))
    .pipe($.postcss(plugins))
    .pipe($.if(options.env === 'prod', $.cleanCss({ compatibility: 'ie8' })))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream())
});

gulp.task('babel', () =>
  gulp.src('./source/js/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['@babel/env']
    }))
    .pipe($.concat('all.js'))
    .pipe($.if(options.env === 'prod', $.uglify()))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/js'))
    .pipe(browserSync.stream())
);

gulp.task('vendorsJs', function(){
  return gulp.src([
    './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
  ])
    .pipe($.concat('vendor.js'))
    .pipe(gulp.dest('./public/js'))
})

gulp.task('html', function(){
  return gulp.src('./source/*.html')
    .pipe($.plumber())
    .pipe($.if(options.env === 'prod', $.htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest('./public/'))
    .pipe(browserSync.stream())
})

gulp.task('clean', function(){
  return gulp.src(['./public'], { read: false, allowEmpty: true })
    .pipe($.clean());
})

gulp.task('deploy', function () {
  return gulp.src('./public/**/*')
    .pipe($.ghPages());
});

gulp.task('build',
  gulp.series(
    'clean',
    'vendorsJs',
    gulp.parallel('sass', 'babel', 'html')
  )
)

gulp.task('default',
  gulp.series(
    'clean',
    'vendorsJs',
    gulp.parallel('sass', 'babel', 'html'),
    function(done){
      browserSync.init({
        server: {
          baseDir: "./public"
        }
      });
      gulp.watch('./source/scss/**/*.scss', gulp.series('sass'));
      gulp.watch('./source/js/**/*.js', gulp.series('babel'));
      gulp.watch('./source/*.html', gulp.series('html'));
      done();
    }
  )
)