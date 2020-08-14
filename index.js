let isReady = false;
Module = {
    onRuntimeInitialized() {
        init();
    }
  }
const cv = require('./opencv.js');
const fs = require('fs');
const Jimp = require('jimp');
const path = require('path');
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();

function init() {
    isReady = true;
    cv.FS_createDataFile(
        '/', 'haarcascade_frontalface_default.xml', 
        fs.readFileSync(path.join(__dirname,'haarcascade_frontalface_default.xml')), 
        true, false, false
    );
    myEmitter.emit('ready');
}

function isReadyFunc () {
    return new Promise((reslove,reject)=>{
        if(isReady){return reslove(isReady)}
        myEmitter.once('ready',()=>{
            return reslove(isReady)
        });
        setTimeout(()=>{
            return reject(new Error('loading opencv time out'))
        },3*1000)
    })
}

async function getFace(srcBuffer,mime='image/jpeg',top=0,right=0,bottom=0,left=0) {
    await isReadyFunc();
    const dstBufferList = []
    var jimpSrc = await Jimp.read(srcBuffer);
    let src = cv.matFromImageData(jimpSrc.bitmap);
    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    let faces = new cv.RectVector();
    let faceCascade = new cv.CascadeClassifier();
    // load pre-trained classifiers
    faceCascade.load('haarcascade_frontalface_default.xml');
    // // detect faces
    let msize = new cv.Size(0, 0);
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);
    for (let i = 0; i < faces.size(); ++i) {
        const rect = {
            x:faces.get(i).x-left,
            y:faces.get(i).y-top, 
            w:faces.get(i).width+(left>faces.get(i).x?faces.get(i).x:left)+right, 
            h:faces.get(i).height+(top>faces.get(i).y?faces.get(i).y:top)+bottom
        }
        const jimpSrcClone = await jimpSrc.clone();
        const jimpDest = await jimpSrcClone.crop(
            rect.x>0?rect.x:0, 
            rect.y>0?rect.y:0, 
            rect.w>0?rect.w:0, 
            rect.h>0?rect.h:0, 
        );
        const imgData = await jimpDest.getBufferAsync(mime);
        dstBufferList.push(imgData);
    }
    src.delete(); gray.delete(); faceCascade.delete();
    faces.delete();
    return dstBufferList;
}

exports.getFace = getFace;