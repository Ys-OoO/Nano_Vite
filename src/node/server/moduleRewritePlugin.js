const { readBody } = require('../utils/fsUtils.js');
const { parse } = require('es-module-lexer');
const { isExternalUrl, isBareUrl } = require('../utils/pathUtils.js');
const MagicString = require('magic-string');

/**
 * 源码注释
 * 用于重写提供的 JavaScript 插件。
 * 将命名模块导入重写为 `/@modules/:id` 请求，例如：
 * "vue" => "/@modules/vue"
 * 重写包含 HMR 代码的文件（引用 `import.meta.hot`）以
 * 注入 `import.meta.hot` 并跟踪 HMR 边界接受白名单。
 * 还在重写过程中跟踪导入者/被导入者关系图。
 * 该图用于 HMR 插件在文件更改时进行分析。
 */
function moduleRewritePlugin(context){
    const {
        root,
        app,
    } = context;
    
    // 注册中间件
    app.use(async (ctx,next)=>{
        // 利用洋葱模型，先让当前请求继续执行后续插件
        // 当后续插件执行完成后，此时ctx上将存在响应的结果，之后再进行处理
        await next();

        /**
         * 源码注释：
         * 我们在所有其他中间件完成后进行 JS 重写；
         * 这允许我们对用户中间件生成的 JavaScript 进行后处理
         * 无论原始文件的扩展名是什么。
         */
        // 此时当前请求的ctx上已存在body，进一步处理body的内容
        // 修改导入
        if(ctx.body && ctx.response.is('js')){
            const content = await readBody(ctx.body);
            ctx.body = rewirteImports(root,content,);
        }
    })
}

/**
 * 将命名模块导入重写为 `/@modules/:id` 请求
 * "vue" => "/@modules/vue"
 */
function rewirteImports(root,source){
    let imports = [];
    imports = parse(source)[0];
    const targetString = new MagicString(source);

    imports.forEach(({
        n, // 导入的具体url
        s, // 导入目标的起始位置
        e, // 终止位置
        ss, // 导入语句的起始位置
        se, // 终止位置
        d // 是否动态导入
    })=>{
        if(d === -1){ // 非动态导入
            if(isExternalUrl(n)){ // 外部导入
                return;
            }

            const resolved = resolveImport(n);
            if(resolved !== n){ // 解析后有修改
                targetString.overwrite(s,e,resolved);
            }
        }
    });
    return targetString.toString();
}

function resolveImport(id){
    if(isBareUrl(id)){
        id = `/@modules/${id}`
    }

    return id;
}

module.exports = moduleRewritePlugin;