const { src, dest, parallel, watch, task } = require('gulp');

// 编译less
const sass = require('gulp-sass');

// 压缩css
const minifyCSS = require('gulp-csso');

// 给css添加前缀
const autoprefixer = require('gulp-autoprefixer');

// 编译es6
const babel = require('gulp-babel');

// 压缩js
const uglify = require('gulp-uglify');


// 删除文件
const del = require('del');

// 给文件加上hash
const rev = require('gulp-rev');

// 替换文件hash
const revCollector = require('gulp-rev-collector');


// 读取配置文件
const { config } = require('./gulpConfig');

// 合并require
const browserify = require('browserify');

// 文件流
const source = require('vinyl-source-stream');

// buffer流
const buffer = require('vinyl-buffer');




// uglify选项
var uglifyOption = {
  mangle: {
    // 压缩函数名称
    toplevel: true,
    // 白名单
    reserved: ['firstLongName'],
  }
}



// 编译js
function CompileJs(cb) {
  console.log('编译js')
  del(config.del.jsPath)
  del('./config/temp/*.js')
  var i = 0;
  config.src.jsPath.map(function (path) {
    var jsName = path.match(/\/([^\/^.]+)\.[^\/]*$/)[1];
    var b = browserify({
      entries: path,
      debug: true
    });
    b.bundle()
      .pipe(source(`${jsName}.js`))
      .pipe(buffer())
      .pipe(babel({
        presets: ['@babel/env']
      }))
      .pipe(uglify(uglifyOption))
      .pipe(dest('./config/temp')).on('end', function () {
        i += 1
        console.log("当前处理第" + i + 'js文件', '总js文件个数：' + config.src.jsPath.length)
        if (i == config.src.jsPath.length) {
          cb();
        }
      })
  });
}
// 编译scss
function CompileScss() {
  console.log('编译scss')
  del(config.del.cssPath)
  del('./config/temp/*.css')
  return src(config.src.cssPath)
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(dest('./config/temp'))
}
// 给js加hash 输出hash配置
function jsFileHash() {
  console.log('给js加hash')
  return src('./config/temp/*.js')
    .pipe(rev())
    .pipe(dest(config.dest.jsPath))
    .pipe(rev.manifest({
      path: `js.json`,
      merge: true,
    }))
    .pipe(dest('./config/json'))
}
// 给css加hash 输出hash配置
function cssFileHash() {
  console.log('给css加hash')
  return src('./config/temp/*.css')
    .pipe(rev())
    .pipe(dest(config.dest.cssPath))
    .pipe(rev.manifest({
      path: `css.json`,
      merge: true,
    }))
    .pipe(dest('./config/json'))
}
// 替换模板hash
function replaceTemplateHash() {
  console.log('替换模板hash')
  return src(['./config/json/*.json'].concat(config.src.template))
    .pipe(revCollector())
    .pipe(dest(config.dest.template))
}

// 流程
function jsTaskFlow() {
  CompileJs(function () {
    jsFileHash().on('end', function () {
      replaceTemplateHash();
    })
  });


}
// 流程
function cssTaskFlow() {
  CompileScss().on('end', function () {
    cssFileHash().on('end', function () {
      replaceTemplateHash();
    })
  });
}


// 监听
watch(['./src/js/*.js'], function (cb) {
  console.log('监听到js文件变化')
  jsTaskFlow()
  cb();
})
watch(['./src/scss/*.scss'], function (cb) {
  console.log('监听到css文件变化')
  cssTaskFlow()
  cb();
})

function defaultTask(cb) {
  jsTaskFlow()
  cssTaskFlow()
  cb();
}
exports.default = parallel(defaultTask);


