var gulp = require('gulp')
var $ = require('gulp-load-plugins')()

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
  return gulp.src('images-src/layout/**/*.{jpg,png}')
    .pipe($.responsive({
      '**/*': buildOutputs([360, 720, 1280, 1920], [1, 2, 3])
    }, {
      progressive: true,
      compressionLevel: 6,
      withMetadata: false,
      withoutenlargement: true,
      skipOnEnlargement: false,
      errorOnEnlargement: false
    }))
  .pipe(gulp.dest('static/layout/'))
})
gulp.task('img-content', function () {
  return gulp.src('images-src/content/**/*.{jpg,png}')
    .pipe($.responsive({
      '**/*': buildOutputs([150, 360, 720, 1280, 1920, 3840], [1])
    }, {
      progressive: true,
      compressionLevel: 6,
      withMetadata: false,
      withoutenlargement: true,
      skipOnEnlargement: true,
      errorOnEnlargement: false
    }))
  .pipe(gulp.dest('static/images/'))
})

gulp.task('images', ['img-layout', 'img-content'])
