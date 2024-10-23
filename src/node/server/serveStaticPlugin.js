const static = require('koa-static');
const path = require('path');


function serveStaticPlugin(context){
    const {app, root} = context;
    // 注册中间件
    // 开启静态服务，静态服务的工作目录是 
    // nano_vite 的运行目录 和 运行目录下的public目录
    app.use(static(root));
    app.use(static(path.join(root,'public')));
}

module.exports = serveStaticPlugin;