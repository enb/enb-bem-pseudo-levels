var path = require('path');
var guesser = require('../../lib/file-guesser');

module.exports = function () {
    return function (file, levels) {
        var fileInfo = guesser.getFileInfo(file, levels);
        var fileName = [fileInfo.name, fileInfo.level.name, file.suffix].join('.');

        return path.join(fileInfo.bem.nestedPath, fileName);
    };
};
