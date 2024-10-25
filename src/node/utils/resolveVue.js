const { version } = require("os");
const { lookupFile } = require("./fsUtils");
const { resolveFrom } = require("./pathUtils");
const path = require('path');

let resolved = undefined;

function resoleVue(root){
    // 判断缓存
    if(resolved){
        return resolved;
    }

    // 从本地package.json中查询
    let vueBasePath,compilerPath;
    const projectPkg = JSON.parse(lookupFile(root,['package.json']) || `{}`);
    let isLocal = !!(projectPkg.dependencies && projectPkg.dependencies.vue);

    // 获取vue文件相关信息
    if(isLocal){ 
        const vuePkgPath = resolveFrom(root,'vue/package.json');
        vueBasePath = path.dirname(vuePkgPath);
    }

    // 获取@vue/compiler-sfc相关信息
    if(isLocal){
        const compilerSfcPkgPath = resolveFrom(root,'@vue/compiler-sfc/package.json');
        const compilerSfcPkg = require(compilerSfcPkgPath);
        compilerPath = path.join(path.dirname(compilerSfcPkgPath),compilerSfcPkg.main);
    }

    if(!isLocal){
        throw new Error('Can not found vue in current project, maybe you should `run npm install vue` !');
    }

    const resolvePath = (name, from) =>
        resolveFrom(from, `@vue/${name}/dist/${name}.esm-bundler.js`)
    
    // resolve nested dependencies with correct base dirs so that this works with
    // strict package managers - e.g. pnpm / yarn 2
    const runtimeDomPath = resolvePath('runtime-dom', vueBasePath)
    const runtimeCorePath = resolvePath('runtime-core', runtimeDomPath)
    const reactivityPath = resolvePath('reactivity', runtimeCorePath)
    const sharedPath = resolvePath('shared', runtimeCorePath)


    resolved = {
        'vue': runtimeDomPath,
        '@vue/runtime-dom': runtimeDomPath,
        '@vue/runtime-core': runtimeCorePath,
        '@vue/reactivity': reactivityPath,
        '@vue/shared': sharedPath,
        'compiler': compilerPath,
    }

    return resolved;
}

module.exports = {
    resoleVue,
}