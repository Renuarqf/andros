module.exports = function() {
    $.gulp.task("sprite", function() {
        return $.gulp.src("./src/images/sprite-svg/*.svg")
            .pipe($.svgSprite({
                shape: {
                    id: {
                        generator: "image-%s"
                    }
                },
                mode: {
                    view: { // Activate the «view» mode
                        bust: false,
                        dest: "../",
                        sprite: "../images/sprites/main.svg",
                        render: {
                            scss: { dest: "../../"+$.path.sources+"src/sass/base/_sprite_generated.scss" }
                        }
                    },
                    // symbol: {
                    //     inline: true,
                    //     dest: "../",
                    //     sprite: "../images/sprites/main.symbol.svg"
                    // },
                    stack: {
                        dest: "../",
                        sprite: "../images/sprites/main.stack.svg"
                    }
                }
            }))
            .pipe($.gulp.dest("./"+$.path.dest+"images/sprites/"))
            .pipe($.debug({"title": "sprite"}));
    });
};