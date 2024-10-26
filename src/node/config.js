const process = require('process');
const path = require('path');
const fs = require('fs');

async function resolveConfig(configPath) {
    const cwd = process.cwd();
    let resolvePath;
    
    if(configPath){
        resolvePath = path.resolve(cwd,configPath);
    }else{
        const jsConfigPath = path.resolve(cwd,'vite.config.js');
        if(fs.existsSync(jsConfigPath)){
            resolvePath = jsConfigPath
        }
    }

    if(!resolvePath){
        return;
    }

    let userConfig; 
    userConfig = require(resolvePath);
    return userConfig;
}

module.exports = {
    resolveConfig,
}