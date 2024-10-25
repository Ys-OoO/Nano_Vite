const { readFile } = require('../utils/fsUtils.js');
const { resoleVue } = require('../utils/resolveVue.js');
const moduleRE = /^\/@modules\//

/**
 * 源码注释：
 * plugin for resolving /@modules/:id requests.
 */
function moduleResolvePlugin (context){
    const {
        app,
        root,
    } = context;

    app.use(async (ctx,next)=>{
        if(!moduleRE.test(ctx.path)){
            return next();
        }

        // bareURL
        const id = decodeURIComponent(ctx.path.replace(moduleRE,''));
        ctx.type = 'js'; // 响应类型

        // 处理vue相关文件
        const vueResolved = resoleVue(root);
        if(id in vueResolved){ // 是vue相关包的引入
            const fileContent = readFile(vueResolved[id]);
            ctx.body = fileContent;
            return next();
        }
    })
}

module.exports = moduleResolvePlugin;