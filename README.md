# gulp-cli
改版后的gulp集成web开发环境

通过`gulpConfig.js`的配置文件即可更换hash文件到指定模板

```javascript
// 配置
exports.config = {
  // 开启map
  sourcemaps:false,
  
  // 启用压缩
  min:false,
  // 资源路径
  src:{
    cssPath:[
      'src/scss/index.scss',
      'src/scss/main.scss'
    ],
    jsPath:[
      'src/js/index.js',
      'src/js/main.js'
    ],
    template:[
      'src/template/test.txt'
    ],
  },
  // 输出资源
  dest:{
    cssPath:'build/css',
    jsPath:'build/js',
    template:'build/template'
  },
  del:{
    cssPath:'build/css/*.css',
    jsPath:'build/js/*.js',
  }
}
```
