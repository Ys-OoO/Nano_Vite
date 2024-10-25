const resolve = require('resolve');

const externalRE = /^(https?:)?\/\//
const isExternalUrl = (url) => externalRE.test(url);

const bareImportRE = /^[^\/\.]/
const isBareUrl = (url) => bareImportRE.test(url);

let isRunningWithYarnPnp;
try {
  isRunningWithYarnPnp = Boolean(require('pnpapi'))
} catch {}

// 在root下导入子路径id
const resolveFrom = (root, id) =>
    resolve.sync(id, {
        basedir: root,
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
        preserveSymlinks: isRunningWithYarnPnp || false
})

module.exports = {
    isExternalUrl,
    isBareUrl,
    resolveFrom
}