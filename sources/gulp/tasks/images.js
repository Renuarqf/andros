module.exports = function() {
    $.gulp.task("images", function() {
        // Just direct copying
        $.gulp.src("./src/images/skip-optimization/**/*")
            .pipe($.newer("./"+$.path.dest+"images/"))
            .pipe($.gulp.dest("./"+$.path.dest+"images/"));

        // With optimization
        return $.gulp.src(["./src/images/**/*",
                    "!./src/images/skip-optimization",
                    "!./src/images/skip-optimization/**/*",
                    "!./src/images/sprite-*",
                    "!./src/images/sprite-*/**/*",
                    "!./src/images/favicons/**/*"])
            .pipe($.newer("./"+$.path.dest+"images/"))
            .pipe($.imagemin([
                $.imagemin.gifsicle({interlaced: true}),
                $.imagemin.jpegtran({progressive: true}),
                $.imageminJpegRecompress({
                    progressive: true,
                    accurate: true,
                    subsample: "disable",
					max: 80,
					min: 70
				}),
                $.imagemin.svgo({plugins: [{removeViewBox: true}]}),
                $.imagemin.optipng({optimizationLevel: 1}),
                $.pngquant({quality: [0.6, 0.95], speed: 3})
            ]))
            .pipe($.gulp.dest("./"+$.path.dest+"images/"))
            .pipe($.debug({"title": "images"}))
            .on("end", $.browsersync.reload);
    });
};