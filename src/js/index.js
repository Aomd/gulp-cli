console.log('main');
// 测试cmd加载方式
require('./test')
require('./test1')
// 测试es功能
var b = '123'
var a = `${b}`
var obj = {
  a,
  b
}
var c = [...obj]

// 测试函数名压缩
function test(){

}

test();