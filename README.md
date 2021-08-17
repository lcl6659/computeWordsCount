小工具-获取所有word文件的总字数

# 一、为啥要做这么个小工具？
一个朋想要计算一下自己写作的总字数，但一篇一篇的打开统计很是麻烦，因为有几百个word，问我有没有什么工具可以一下子统计出来，我哪知道有什么工具呀，然后就想着帮他写一个。

# 二、功能
功能很简单，就是打印出文件夹下，每一篇word的总字数，然后合计一下


# 三、项目设计

### 1、使用的第三方包
1. fs：负责读取文件夹，获取word文件路径
2. path：定位文件夹路径
3. textract：读取word内容

### 2、项目架构

```
- docs                  --> 存放word的文件夹
- src
    - utils
        - common.js     --> 一些工具方法
    - index.js          --> 主文件
pacjage.json
```

# 四、相关代码
### index.js

```js
const path = require('path')
const util = require('./utils/common')

// 文档目录地址
const docsDirPath = path.join(__dirname, '../docs')

// 文件夹下所有word文件 key是文件名，value是文件地址
const wordFiles = util.getAllWordFile(docsDirPath)

const fileNames = Object.keys(wordFiles)

let fileWords = {}

// 循环列表。获取各个word的字数
fileNames.forEach(filename => {
  const filePath = wordFiles[filename]
  util.getWordsCountInWord(filePath, (len) => {
    console.log(filename, len)
    fileWords[filename] = len
    const lens = Object.values(fileWords)
    if (lens.length === fileNames.length) {
      computeCount(lens)
    }
  })
})

// 计算总字数
function computeCount (lens) {
  let count = lens.reduce((prev, cur) => {
    return prev + cur
  })
  console.log('总字数：', count)
}

```

#### commom.js

```js
const fs  = require('fs')
const textract = require('textract')

// 获取文件夹下的所有word文件
function getAllWordFile (path, fileObj = {}) {
  try {
    fs.accessSync(path)
    var files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      var curPath = path +"/" + file;
      if (fs.statSync(curPath).isDirectory()) { // 文件夹
        fileObj = findJsAndMap(curPath, fileObj)
      } else { // 文件
        if (file.endsWith('.docx')) {
          fileObj[file] = curPath
        }
      }
    })
    return fileObj
  } catch (error) {
    console.log(error)
  }
}

// 获取word文件内的字数
function getWordsCountInWord (path, cb) {
  textract.fromFileWithPath(path, function( error, text ) {
    if (!error) {
      let fileContent = text
      fileContent = fileContent.replace(/(\r\n+|\s+|　+)/g,"");
      fileContent = fileContent.replace(/[\x00-\xff]/g,"m");	
      fileContent = fileContent.replace(/m+/g,"*");
      cb && cb(fileContent.length)
    } else {
      console.log(error)
    }
  })
}

module.exports = {
  getAllWordFile,
  getWordsCountInWord
}
```

#### package.json

```json
{
  "name": "computewordscount",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "node src/index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "fs": "^0.0.1-security",
    "path": "^0.12.7",
    "textract": "^2.5.0"
  }
}
```

# 五、运行结果

```shell
➜  computeWordsCount yarn test
yarn run v1.22.5
$ node src/index.js
春江花月夜.docx 293
文档01.docx 285
总字数： 578
```
