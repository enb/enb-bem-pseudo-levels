var vow = require('vow'),
    Level = require('enb-bem-techs/lib/levels/level');

function getAllLevelFiles(level) {
    var blocks = level.blocks,
        files = [];

    Object.keys(blocks).forEach(function (blockName) {
        files = files.concat(getAllFilesInElement(blocks[blockName]));
    });

    return files;
}

function getAllFilesInElement(element) {
    var files = element.files,
        dirs = element.dirs,
        mods = element.mods,
        elements = element.elements;

    Object.keys(mods).forEach(function (modName) {
        var mod = mods[modName];

        Object.keys(mod).forEach(function (modVal) {
            files = files.concat(mod[modVal].files);
            dirs = dirs.concat(mod[modVal].dirs);
        });
    });

    if (elements) {
        Object.keys(elements).forEach(function (elemName) {
            files = files.concat(getAllFilesInElement(elements[elemName]));
        });
    }

    return files.concat(dirs);
}

function scanLevels(levels) {
    return vow.all(levels.map(function (level) {
            return new Level(level.path).load();
        }))
        .then(function (levels) {
            var files = [];

            levels.forEach(function (level) {
                files = files.concat(getAllLevelFiles(level));
            });

            return files;
        });
}

exports.scan = scanLevels;
