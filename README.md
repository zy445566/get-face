# get-face
use wasm opencv.js to get face!

# use
```sh
npm i get-face
```

# example
```js
const getFace = require('get-face');
const fs = require('fs');
const faceImgBufList = await getFace.getFace(fs.readFileSync('./imgInput.jpg'),'image/jpeg');
for(let i=0;i<faceImgBufList.length;i++) {
    fs.writeFileSync(`./imgOnput${i}.jpeg`,faceImgBufList[i]);
}
```
## imgInput.jpg
![imgInput.jpg](https://raw.githubusercontent.com/zy445566/get-face/master/imgInput.jpg)

## imgOnput0.jpeg
![imgOnput0.jpeg](https://raw.githubusercontent.com/zy445566/get-face/master/imgOnput0.jpeg)

# API
## Function
####  getFace @return Promise<Array<Buffer>> (face photo's buffer )
|ParamName |Must|Type|Default|Remark|
|:----    |:---|:----- |:----- |-----   |
|srcBuffer |yes  |Buffer |  / | photo's buffer  |
|mime |no  |string |  "image/jpeg"  |alltype: "image/png","image/jpeg","image/bmp" |
|top |no  |number |  0   |   |
|right |no  |number |  0   |   |
|bottom |no  |number |  0   |   |
|left |no  |number |  0   |   |