const externalRE = /^(https?:)?\/\//
const isExternalUrl = (url) => externalRE.test(url);

const bareImportRE = /^[^\/\.]/
const isBareUrl = (url) => bareImportRE.test(url);

module.exports = {
    isExternalUrl,
    isBareUrl
}