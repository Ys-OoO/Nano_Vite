const fs = require('fs');
const { readBody } = require('../utils/fsUtils');

function htmlRewritePlugin(context){
    const {
        root,
        app
    } = context;
    const injectionCode = `\n<script> ${fs.readFileSync('./node_modules/nano_vite/src/client/client.js')}</script>\n`;
    app.use(async (ctx,next)=>{
        await next();

        if(ctx.response.is('html') && ctx.body){
            const html = await readBody(ctx.body);
            ctx.body = html.replace(/<head>/, injectionCode);
        }
    })
}

module.exports = htmlRewritePlugin;