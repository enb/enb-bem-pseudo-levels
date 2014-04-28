var path = require('path');
var guesser = require('../../lib/file-guesser');

module.exports = function () {
    return function (file) {
        return path.join(guesser.buildBemNestedPath(file), file.name);
    };
};
