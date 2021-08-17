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