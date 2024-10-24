const Koa = require('koa');

function createServer(config){

    const app = new Koa();

    // 构建服务运行时的上下文
    const context = {
        root: process.cwd(),// 运行时根目录
        app, // 服务实例
        port: config.port || 3000
    }

    // * 服务需要对源代码/文件进行处理，这些处理被封装为一个个的插件
    // * 提供静态服务 or HMR or SourceMap or 源代码Rewrite or vue等文件的处理插件等等
    // * 插件的顺序也需要注意，因为相互之间可能存在影响
    const resolvedPlugins = [
        require('./moduleRewritePlugin'), // 模块重写插件，"vue" => "/@modules/vue", 重写HMR相关文件，注入import.meta.hot以便于跟踪
        require('./serveStaticPlugin'), // 提供静态服务
    ];
    // 执行插件
    resolvedPlugins.forEach(p=>p && p(context));

    return app;
}

module.exports = {
    createServer
};