const assert =  require('assert')
const index = require('./index')
const fs = require('fs')
const testUnit = {
    [Symbol('test.getFace')] : async function() {
        const faceImgBufList = await index.getFace(fs.readFileSync('./imgInput.jpg'),'image/jpeg');
        for(let i=0;i<faceImgBufList.length;i++) {
            fs.writeFileSync(`./imgOnput${i}.jpeg`,faceImgBufList[i]);
        }
    },
}


async function run(testUnitList) {
    for(let testUnitValue of testUnitList) {
        for(let testFunc of Object.getOwnPropertySymbols(testUnitValue)) {
            await testUnitValue[testFunc]();
        }
    }
}
(async function() {
    await run([testUnit]);
})();

