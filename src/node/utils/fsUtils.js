const { Readable } = require('stream');
const path = require('path');
const fs = require('fs');

async function readBody(stream) {
    if (stream instanceof Readable) {
        return new Promise((resolve, reject) => {
            let res = '';
            stream
            .on('data', (chunk) => (res += chunk))
            .on('error', reject)
            .on('end', () => {
                resolve(res)
            })
        })
    } else {
        return !stream || typeof stream === 'string' ? stream : stream.toString()
    }
}

function lookupFile(dir, targets, pathOnly = false){
    for (const target of targets) {
        const fullPath = path.join(dir, target);
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) { // 存在且是文件
            return pathOnly ? fullPath : fs.readFileSync(fullPath, 'utf-8');
        }
    }
    const parentDir = path.dirname(dir);
    if (parentDir !== dir) {
        return lookupFile(parentDir, targets, pathOnly);
    }
}

function readFile(path){
    return fs.readFileSync(path,{encoding:'utf-8'});
}

module.exports = {
    readBody,
    lookupFile,
    readFile
}