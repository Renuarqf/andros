global.$ = {
    gulp: require("gulp"),
    browsersync: require("browser-sync").create(),
    packageJson: require('./package.json'),
    autoprefixer: require("gulp-autoprefixer"),
    babel: require("gulp-babel"),
    uglify: require("gulp-uglify"),
    pug: require("gulp-pug"),
    sass: require("gulp-sass"),
    mincss: require("gulp-clean-css"),
    sourcemaps: require("gulp-sourcemaps"),
    concat: require("gulp-concat"),
    addsrc: require('gulp-add-src'),
    rename: require("gulp-rename"),
    imagemin: require("gulp-imagemin"),
    pngquant: require("imagemin-pngquant"),
    imageminJpegRecompress: require("imagemin-jpeg-recompress"),
    favicons: require("gulp-favicons"),
    svgSprite: require('gulp-svg-sprite'),
    replace: require("gulp-replace"),
    newer: require("gulp-newer"),
    plumber: require("gulp-plumber"),
    debug: require("gulp-debug"),
    watch: require("gulp-watch"),
    clean: require("gulp-clean"),

    path: {
        tasks: require("./gulp/config.js"),
        dest: '../html/', // or just 'html/', 'dest/' — for current folder. WARNING: This directory will be cleaned at build!
        sources: 'sources/' // or '/' — for current folder
    }
};

$.path.tasks.forEach(function(taskPath) {
    require(taskPath)();
});

// BUILD
$.gulp.task("default", $.gulp.series("clean", "sprite", "libs", "fonts",
    $.gulp.parallel("pug", "styles", "favicons", "images", "scripts"),
    $.gulp.parallel("watch", "serve")
));