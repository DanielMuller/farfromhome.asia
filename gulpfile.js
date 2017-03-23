const gulp = require('gulp')
const $ = require('gulp-load-plugins')()

// image lossy compression plugins
const compressJpg = require('imagemin-jpeg-recompress')
const pngquant = require('imagemin-pngquant-gfw')

const layoutSrc = 'images-src/layout'
const layoutDst = 'static/layout'
const contentSrc = 'images-src/content'
const contentDst = 'static/images'
const pngFilter = $.filter(['**/*.png'], {restore: true})

function buildOutputs (sizes, resolutions) {
  var outputs = []
  for (let i = 0; i < sizes.length; i += 1) {
    let size = sizes[i]
    for (let j = 0; j < resolutions.length; j += 1) {
      let res = resolutions[j]
      let resext = '-' + res + 'x'
      if (res === 1) { resext = '' }
      let output = {
        width: size * res,
        rename: {
          suffix: '-' + size + 'px' + resext
        }
      }
      outputs.push(output)
      output = {
        width: size * res,
        rename: {
          suffix: '-' + size + 'px' + resext,
          extname: '.webp'
        }
      }
      outputs.push(output)
    }
  }
  outputs.push({
    progressive: true,
    compressionLevel: 6,
    withMetadata: false
  })
  outputs.push({
    rename: {
      extname: '.webp'
    }
  })
  return outputs
}

gulp.task('img-layout', function () {
  return gulp.src(layoutSrc + '/**/*.{jpg,png}')
    .pipe($.responsive({
      '**/*': buildOutputs([360, 720, 1280, 1920], [1, 2, 3])
    }, {
      progressive: true,
      compressionLevel: 6,
      withMetadata: false,
      withoutenlargement: true,
      skipOnEnlargement: false,
      errorOnEnlargement: false,
      errorOnUnusedConfig: false
    }))
    .pipe($.imagemin([
      $.imagemin.gifsicle(),
      compressJpg({
        loops: 4,
        min: 50,
        max: 95,
        quality: 'high'
      }),
      $.imagemin.optipng(),
      $.imagemin.svgo()
    ]))
    .pipe(pngFilter)
    .pipe(pngquant({ quality: '65-80', speed: 4 })())
    .pipe(pngFilter.restore)
  .pipe(gulp.dest(layoutDst))
})
gulp.task('img-content', function () {
  return gulp.src(contentSrc + '/**/*.{jpg,png}')
    .pipe($.responsive({
      '**/*': buildOutputs([150, 360, 720, 1280, 1920, 3840], [1])
    }, {
      progressive: true,
      compressionLevel: 6,
      withMetadata: false,
      withoutenlargement: true,
      skipOnEnlargement: true,
      errorOnEnlargement: false,
      errorOnUnusedConfig: false
    }))
    .pipe($.imagemin([
      $.imagemin.gifsicle(),
      compressJpg({
        loops: 4,
        min: 50,
        max: 95,
        quality: 'high'
      }),
      $.imagemin.optipng(),
      $.imagemin.svgo()
    ]))
    .pipe(pngFilter)
    .pipe(pngquant({ quality: '65-80', speed: 4 })())
    .pipe(pngFilter.restore)
    .pipe(gulp.dest(contentDst))
})

gulp.task('images', ['img-layout', 'img-content'])
