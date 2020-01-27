const fs = require('fs');

module.exports = function sourceCodeLoader() {
    const source = fs.readFileSync(this.resourcePath, 'utf-8');
    return `export default ${JSON.stringify(source)}`;
};
