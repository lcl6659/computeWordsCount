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
