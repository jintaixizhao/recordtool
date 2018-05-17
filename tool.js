Date.prototype.format = function(format) {
  let o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    "S": this.getMilliseconds()
  }

  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (let k in o) if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}


const fs = require("fs")
const os = require('os');
const eol = os.EOL
const assetsPath = './assets/'
const targetPath = process.argv[2]
let template = `---${eol}title: ${targetPath}${eol}date: ${new Date().format('yyyy-MM-dd hh:mm:ss')}${eol}tags: 郭予一${eol}---${eol.repeat(2)}&nbsp;${eol.repeat(2)}`
const eof2 = eol.repeat(2)

const readDir = path=>new Promise(resolve=>{
    fs.readdir(path,'utf8',(err,files)=>{
        if(err) throw err;
        resolve(files)
    })
})

const writeMd=data=>{
    fs.writeFile(assetsPath+targetPath+".md",data,(err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
}
async function getTemplate(){
    const files = await readDir(assetsPath + targetPath)
    files.reverse().forEach(i=>{
        const type = /\..+$/.exec(i)[0].slice(1)
        switch(type){
            case 'jpg':
            case 'png':
            case 'gif': template+="!["+targetPath+"]("+targetPath+"/"+i+")"+eof2;break;
            case 'mp4': template+="<video src='./"+i+"'  type='video/mp4'  controls='controls'  width='270' height='510'></video>"+eof2;break;
            case 'm4a':
            case 'mp3': template+="<audio src='./"+i+"' controls='controls'>您的浏览器不支持 audio 标签。</audio>"+eof2;break;
        }
    })
    writeMd(template)
}

getTemplate()


