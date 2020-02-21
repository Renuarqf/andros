module.exports = function() {
    $.gulp.task("libs", function() {
        var modules = Object.keys($.packageJson.dependencies);
        var moduleFiles = modules.map(function(module) {
            return "./node_modules/" + module + "/**/*";
        });
        return $.gulp.src(moduleFiles, {base: "./node_modules/"})
            .pipe($.gulp.dest("./src/libs/"));
    });
};