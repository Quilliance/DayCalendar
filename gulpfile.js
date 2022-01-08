const gulp = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const jslint = require('gulp-jslint');
const browserSync = require('browser-sync').create();
// call webpack from gulp
const webpack = require('webpack');
const webpackDevConfig = require('./webpack.dev');
const webpackProdConfig = require('./webpack.prod');

gulp.task('styles', () => {
  return gulp.src('sass/DayCalendar.scss')
    .pipe(sass({
      outputStyle: 'nested',
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
});

gulp.task('styles-production', () => {
  return gulp.src('sass/DayCalendar.scss')
    .pipe(sass({
      outputStyle: 'compressed',
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'));
});


gulp.task('compile-js', () => {
  return gulp.src('src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(jslint({
      predef: [ '' ],
      global: [ '' ]
    }))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'))
    .pipe(browserSync.stream());
});

gulp.task('compile-jsx', () => {
  return gulp.src('src/**/*.jsx')
    .pipe(sourcemaps.init())
    .pipe(jslint({
      predef: [ '' ],
      global: [ '' ]
    }))
    .pipe(babel({
      presets: ['@babel/env'],
      plugins: ['transform-react-jsx']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'))
    .pipe(browserSync.stream());
});

/** compiles the TS via webpack for a given config file */
const compileTypescriptViaWebpack = (config) => {
  return new Promise((resolve, reject) => {
    // call webpack
    webpack(config, (err, stats) => {
      if (err) {
        return reject(err);
      }
      if (stats.hasErrors()) {
        return reject(new Error(stats.compilation.errors.join('\n')))
      }
      resolve();
    });
  });
};

gulp.task('typescript', () => {
  return new Promise((resolve, reject) => {
    compileTypescriptViaWebpack(webpackDevConfig)
      .then(() => {
        browserSync.reload();
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  })
  // return compileTypescriptViaWebpack(webpackDevConfig);
});
gulp.task('typescript-production', () => {
  return compileTypescriptViaWebpack(webpackProdConfig);
})


gulp.task('compile', gulp.series(['compile-js', 'compile-jsx', 'typescript']));


gulp.task('watch', gulp.series(['styles', 'compile', () => {
  browserSync.init({
    server: "./public",
    open: false
  });

  gulp.watch('sass/**/*.scss', gulp.series(['styles']));
  gulp.watch('src/**/*.js', gulp.series(['compile-js']));
  gulp.watch('src/**/*.jsx', gulp.series(['compile-jsx']));
  gulp.watch('src/**/*.ts', gulp.series(['typescript']));
  gulp.watch('src/**/*.tsx', gulp.series(['typescript']));
}]));


// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./public"
    }
  });
});




gulp.task('default', gulp.series(['styles', 'compile']));
gulp.task('production', gulp.series(['styles-production']));
