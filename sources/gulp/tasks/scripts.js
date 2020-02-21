module.exports = function () {
    $.gulp.task("scripts", function () {
        var libs_file = "src/js/_libs_concat.js";

        delete require.cache[require.resolve("../../"+libs_file)];
        var libs_concat = require("../../"+libs_file);

        // Json Direct copying
        $.gulp.src("./src/js/**/*.json")
            .pipe($.gulp.dest("./"+$.path.dest+"js/"));

        return $.gulp.src(["./src/js/**/*.js", "!./"+libs_file])
            .pipe($.sourcemaps.init())
            .pipe($.babel({presets: ["@babel/preset-env"]}))
            .pipe($.uglify())
            .pipe($.addsrc.prepend(libs_concat))
            .pipe($.concat("main.min.js"))
            .pipe($.sourcemaps.write("./maps/"))
            .pipe($.gulp.dest("./"+$.path.dest+"js/"))
            .pipe($.debug({"title": "scripts"}))
            .pipe($.browsersync.stream());
            //.on("end", $.browsersync.reload);
    });
};