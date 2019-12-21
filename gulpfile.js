/** Gulp package as task runner */
const {src, dest, series, parallel} = require('gulp');
/** Process gulp-sass to css */
const sass = require('gulp-sass');
/** Add the sourcemaps for css & js to back trace the error line */
const sourcemaps = require('gulp-sourcemaps');
/** Auto-prefix different browser prefixes */
const autoprefixer = require('autoprefixer');
/** Pipeline the css and process at a stretch */
const postcss = require('gulp-postcss');
/** Delete the files or folders */
const del = require('del');
/** For minifying css files */
const cssnano = require('cssnano');
/** Concat css & js files */
const concat = require('gulp-concat');
/** Upgrade version version gulp default watch */
const watch = require('gulp-watch');
/** Reload the browser in dev mode */
const browserSync = require('browser-sync');
/** Minify js files */
const uglify = require('gulp-uglify');
/** Library for image re-sizes */
const resize = require('gulp-image-resize');
/** Minification of images */
const imagemin = require('gulp-imagemin');
const paths = {
    dev : './dev/', /** Development Directory */
    assets : './assets/', /** Distribution Directory - For Production */
    nodecss : {
        src : [ './node_modules/normalize.css/normalize.css' ],
        dest : [ './assets/css/' ]
    },
    sass : {
        src : [ './dev/sass/**' ],
        dest : [ './assets/css/' ]
    },
    js:{
        src : [ './dev/js/**', './node_modules/jquery/dist/jquery.js' ],
        dest : [ './assets/js/' ]
    },
    images:{
        src : [ './dev/images/**' ],
        dest : [ './assets/images/' ]
    },
    resizeImages:{
        src : [ './dev/resize_images/**' ],
        dest : [ './dev/images/' ]
    }
}

/** Clean the distribution folders for fresh code */
function cleanTask(){
    return del(paths.assets+'**')
}

/** Copy nodejs css files to distribution css folder */
function copyNodeCssTask(){
    return src(paths.nodecss.src)
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.nodecss.dest));
}

/** Compile sass to css */
function sassToCssTask(){
    return src(paths.sass.src)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.sass.dest));
}

/** Minify css & merge into single file */
function minifyCssTask(){
    return src([paths.assets+'css/normalize.css', paths.assets+'css/*.css'])
        .pipe(sourcemaps.init())
        .pipe(concat('style.min.css'))
        .pipe(postcss([ autoprefixer(), cssnano() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.assets+'css/'));
}

/** Copy js files to distribution */
function copyJsTask(){
    return src(paths.js.src)
        .pipe(sourcemaps.init(paths.js.src))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.js.dest));
}

/** Combine & minify all the js files */
function minifyJsTask(){
    return src([paths.assets+'js/jquery.js', paths.assets+'js/*.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.assets+'js/'));
}

/** Minify the image sizes */
function minifyImagesTask(){
    return src(paths.images.src)
        .pipe(imagemin())
        .pipe(dest(paths.images.dest));
}

/** Resize the images and put to development images and then will intern push to distribution images */
function resizeImagesTask(){
    return src(paths.resizeImages.src)
        .pipe(resize({
            width: 200,
            quality: 0.6
        }))
        .pipe(dest(paths.resizeImages.dest));
}

/** Watch all the development folder and perform actions accordingly */
function watchDevAssetsTask(){
    watch([ paths.dev+'**/**' ], 
        series(
            cleanTask,
            parallel(sassToCssTask, copyNodeCssTask, copyJsTask),
            parallel(minifyCssTask, minifyJsTask),
            resizeImagesTask,
            minifyImagesTask
        )
    );
}

/** Watch if any html files changes and reload the browser on file save */
function watchHtmlTask(){
    watch('./**/*.html', function() {
        browserSync.reload();
    });
}

/** Start the browser-sync */
function browser(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
}

/** Exporting the tasks with parallel & series tasks */
exports.default = series(
    cleanTask, 
    parallel(
        sassToCssTask, copyNodeCssTask, copyJsTask
    ),
    parallel(
        minifyCssTask, minifyJsTask
    ),
    resizeImagesTask,
    minifyImagesTask,
    parallel(
        browser, watchDevAssetsTask, watchHtmlTask
    )
);