const Koa = require('koa');

function createServer(config){

    const app = new Koa();

    // 构建服务运行时的上下文
    const context = {
        root: process.cwd(),// 运行时根目录
        app, // 服务实例
        port: config.port || 3000
    }

    // * 服务需要对源代码进行处理，这些处理被封装为一个个的插件
    const resolvedPlugins = [
        require('./serveStaticPlugin'), // 提供静态服务
    ];
    // 执行插件
    resolvedPlugins.forEach(p=>p && p(context));

    return app;
}

module.exports = {
    createServer
};