var guesser = require('../../lib/file-guesser');

module.exports = function () {
    return function (file, levels) {
        var fileInfo = guesser.getFileInfo(file, levels);

        return [fileInfo.name, fileInfo.level.name, file.suffix].join('.');
    };
};
