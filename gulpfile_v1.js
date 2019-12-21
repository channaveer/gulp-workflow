/** IMPORTANT PLUGINS */
/** 
gulp gulp-sass gulp-autoprefixer browser-sync del gulp-connect(server) node-sass gulp-sourcemaps gulp-uglify gulp-concat gulp-plumber gulp-csso gulp-concat gulp-rename gulp-postcss 
gulp-imagemin gulp-svgmin gulp-responsive gulp-replace 
*/
const {src, dest, parallel, series, watch} = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const connect = require('gulp-connect');
const rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
const paths = {
    asset: './asset/',
    dev: '.dev/',
    sass: './dev/sass/**',
    js: './dev/js/**',
    images: './dev/images/**',
};

function clean(){
    return del(paths.asset+'**');
}

// function copyCss(){
//     return src(paths.sass)
//         .pipe(dest(paths.asset+'css/'));
// }

// function copyJs(){
//     return src(paths.js)
//         .pipe(dest(paths.asset+'js/'));
// }

// function copyImages(){
//     return src(paths.images)
//         .pipe(dest(paths.asset+'images/'));
// }

function sassToCss(){
    return src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed', outFile: 'style.min.css' }))
        .pipe(sourcemaps.write('.'))
        // .pipe(rename('style.min.css'))
        .pipe(dest(paths.asset+'css/'))
        .pipe(connect.reload());
}

function watchHtml(){
    return src('./*.html')
        .pipe(connect.reload());
}

function watchFiles(){
    watch(paths.sass, sassToCss);
    watch('./*.html', watchHtml);
}

function server(){
    connect.server({
        livereload: true
    });
}

exports.default = series(clean, parallel(sassToCss), parallel(server, watchFiles));