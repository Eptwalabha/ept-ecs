var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var uglify = require("gulp-uglify");
var tsify = require("tsify");
var rename = require("gulp-rename");

gulp.task("default", ["tsc"], minify);
gulp.task("tsc", tsc);

function minify (done) {
    gulp.src(["dist/*.js", "!**/*.min.js"])
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.extname = ".min.js";
        }))
        .pipe(gulp.dest("dist"))
        .on('end', done);
}

function tsc (done) {
    browserify({
        basedir: ".",
        debug: false,
        entries: ['src/index.ts'],
        standalone: "ECS",
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('ept-ecs.js'))
        // .pipe(buffer())
        .pipe(gulp.dest("dist"))
        .on('end', done);
}
