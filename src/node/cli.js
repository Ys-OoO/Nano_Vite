const os = require('os');
const { resolveConfig } = require('./config');

async function resolveOptions() {
    const config = await resolveConfig();

    return config;
}

function runServe(options){
    const server = require('./server/index').createServer(options);
    let port = options.port || 3000;
    const protocol = options.https ? 'https' : 'http';

    server.listen(port,()=>{
        // 打印一些服务运行的信息
        console.log(" Dev server runing at:");
        const interfaces = os.networkInterfaces();
        Object.keys(interfaces).forEach(key=>{
            (interfaces[key] || [])
                .filter(detail=> detail.family === "IPv4")
                .map(detail=> ({
                    type:detail.address.includes('127.0.0.1') ? 'Local:' : 'Network:',
                    host: detail.address
                }))
                .forEach(({type,host})=>{
                    const url = `${protocol}://${host}:${port}`;
                    console.log(` > ${type} ${url}`);
                })
        });


    })
}

async function start() {
    const options = await resolveOptions();
    runServe(options || {});
}

start();