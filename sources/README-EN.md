# LiveHTML Gulp builder. Pug + Sass/SCSS.

The builder is based on [Gulppack](https://github.com/andreyalexeich/gulppack-pug), but a lot of things were rewritten and improved. From the description of Gulppack: assembly to automate tasks in everyday front-end development. Compile Sass/SCSS and Pug, compress files, optimize images, write JS in ES6. Each time you save a file in the code editor, the browser automatically reloads the page. Do not worry that you have to perform routine work.

## What does the builder include?

* [browser-sync](https://browsersync.io/docs/gulp) — live reload web-page when you make changes in source files;
* [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer) — automatically put prefixes in CSS files according to [Can I Use](https://caniuse.com/);
* [gulp-babel](https://www.npmjs.com/package/gulp-babel) — using ES6 with [Babel](https://babeljs.io/);
* [gulp-uglify](https://www.npmjs.com/package/gulp-uglify) — minificator of JS-files;
* [gulp-pug](https://www.npmjs.com/package/gulp-pug) — compiler Pug into HTML;
* [gulp-sass](https://www.npmjs.com/package/gulp-sass) — compiler Sass/SCSS into CSS;
* [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css) — minificator of CSS-files;
* [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) — style map;
* [gulp-concat](https://www.npmjs.com/package/gulp-concat) — file concat;
* [gulp-add-src](https://www.npmjs.com/package/gulp-add-src) — adding files for concat;
* [gulp-rename](https://www.npmjs.com/package/gulp-rename) — rename files, add suffixes (eg .min for minified files);
* [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin) — compress images PNG, JPG, GIF and SVG;
* [imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant) — addon for gulp-imagemin to work with PNG;
* [imagemin-jpeg-recompress](https://www.npmjs.com/package/imagemin-jpeg-recompress) — addon for gulp-imagemin to work with JPG;
* [gulp-favicons](https://github.com/evilebottnawi/favicons) — favicon generator for your project;
* [gulp-svg-sprite](https://www.npmjs.com/package/gulp-svg-sprite) — generate a SVG-sprite;
* [gulp-replace](https://www.npmjs.com/package/gulp-replace) — replace strings in source files;
* [gulp-newer](https://www.npmjs.com/package/gulp-newer) — addon for ```gulp-imagemin``` to compress only new added files;
* [gulp-plumber](https://www.npmjs.com/package/gulp-plumber) — notifications in terminal (eg, errors in Sass/SCSS when compiling);
* [gulp-debug](https://www.npmjs.com/package/gulp-debug) — debug in terminal;
* [gulp-watch](https://www.npmjs.com/package/gulp-watch) — file watcher for changes in sources;
* [gulp-clean](https://www.npmjs.com/package/gulp-clean) — remove files and folders.

## How to prepare?

* [NPM](https://nodejs.org/) or [Yarn](https://yarnpkg.com/en/docs/install) (recommend, faster) should be installed;
* ```gulp``` should be installed globally, run in terminal: ```npm install -g gulp-cli``` or ```yarn global add gulp-cli```;
* download our markup as zip or clone it from git and extract (probably you have done it if you read this doc);
* in terminal go to sources folder from the archive: ```cd sources```;
* run command to download and prepare components of the builder: ```npm install``` or ```yarn```;

## How to build?

Project builds in ```html``` folder near ```sources```.

So, you have opened terminal, working folder  — ```sources```
Run: ```gulp```

![](https://myscreenshot.ru/rv6wj.png)

If everything is okay you should see opened browser with local server at http://localhost:9000 with working project and active live reload. Build successful and new markup is in ```html``` folder.

At the same time you have active monitoring for file changes in the directories:
* ```sources/src/pug/**/*.pug```
* ```sources/src/sass/**/*.{scss,sass}```
* ```sources/src/fonts/**/*```
* ```sources/src/images/**/*``` — all images will be compressed automatically
* ```sources/src/images/favicons/*``` — all necessary favicons are generated from one image
* ```sources/src/images/skip-optimization/**/*``` — put here images which are not necessary to compress (eg. you compressed it manually)
* ```sources/src/images/sprite-svg/*.svg``` — all svg files here will be collected in one sprite
* ```sources/src/js/**/*.js``` — all js files will be concatenated into one main.min.js

To stop watcher press  ```Ctrl + C```.


## Sass vs SCSS

The compiler supports both formats. The only condition is that a single .sass or .scss file must be written either in pure sass syntax or scss. At the same time, the different files that you import can be differently written (.sass or .scss, respectively).


## Image Optimization

The builder performs automatic image compression, priority is given to the maximum visual quality, with no obvious artifacts on any displays. Considering this, Google PageSpeed or other similar tools for analyzing image compression may indicate the need to further compress images — you decide what is more important. You can change the compression level with the appropriate settings in ```sources/gulp/tasks/images.js``` and restart the build of ```gulp```.

**JPG**: optimization is configured and works fine, the main thing is to use JPG with a quality of 100% (without any initial compression).

**PNG**: optimization is configured and works well. In some cases, [TinyPNG](https://tinypng.com/) will be better (in quality and/or compression ratio), but overall the result is close. PNGs also keep the original (PNG24), without compression and/or any optimizations.

**SVG**: optimization is configured and works fine. However, the svg format itself is very complicated, it can include raster graphics inside(!), animations, so svg output loss/distortion is not excluded (in this case, use the advice below). However, during testing, no problems with this optimizer have been identified.

In the builder there is a folder ```sources/src/images/skip-optimization/``` — all files from it are copied without any changes to ```html/images/```.
In case if optimizer suddenly worked poorly for a particular image, we’ll optimize it manually.
**Note:** save the file in ```sources/src/images/skip-optimization/``` make sure that there is no file with the same name in the main folder ```sources/src/images/```.



## Icon Font? We don't use it anymore!

And instead we use svg sprites. Font was used earlier for maximum cross-browser compatibility, now it is not relevant. Detailed comparison [here](https://css-tricks.com/icon-fonts-vs-svg/).


## Bower or adding a libraries (including jQuery, slick, etc.)

Previously, Bower was popular for automatic downloading of libraries, plugins, now almost everything supports adding via NPM or Yarn.

For example, you need [jQuery](https://jquery.com/) (perhaps already used in the layout), enter the command: ```npm install jquery``` or ```yarn add jquery```.

The library will be downloaded to ```sources/node_modules```, and a dependency will be added to ```sources/package.json```.
When the dependency is already registered — these commands are not needed, everything is automatically downloaded when the project is deployed (```npm install``` or ``` yarn```).
To remove: ```npm uninstall jquery``` or ```yarn remove jquery```. You can also manually clean the ```sources/package.json``` and run ```npm install``` or ```yarn```.
Note: in this way deleted libraries **are not automatically deleted** from ```sources/src/libs```. So, everything superfluous should be cleaned manually.

Next, run: ```gulp``` — all libraries will be copied to ```sources/src/libs```. Source files, documentation will also be included there.
Layout usually uses only collected minified distributions, most often they are in the ```dist``` folder.

The path to the libraries is written in ```sources/src/js/libs_concat.js```.
While building all JS are merging into one file ```html/js/main.min.js``` and usually it is linked in ```sources/src/pug/base/_layout.pug```.

## Questions, comments, suggestions?

Write to us [on the site](https://livehtml.io/tasks), hello@livehtml.io or Telegram / Skype / WhatsApp / Viber: +375445954030
