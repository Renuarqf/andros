module.exports = function() {
    $.gulp.task("pug", function() {
        return $.gulp.src(["./src/pug/*.pug", "!./src/pug/_*.pug", "!./src/pug/blocks/*.pug", "!./src/pug/base/*.pug"])
            .pipe($.pug({pretty: true}))
            .pipe($.replace("../../"+$.path.dest, "")) // .pipe($.replace("../dest/", "../"))
            .pipe($.gulp.dest("./"+$.path.dest))
            .pipe($.debug({"title": "html"}))
            .on("end", $.browsersync.reload);
    });
};