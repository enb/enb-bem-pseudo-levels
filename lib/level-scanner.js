var path = require('path');
var fs = require('fs');
var vow = require('vow');
var vfs = require('vow-fs');
var Level = require('enb/lib/levels/level');

function getAllLevelFiles(level) {
    var blocks = level.blocks;
    var files = [];

    Object.keys(blocks).forEach(function (blockName) {
        files = files.concat(getAllFilesInElement(blocks[blockName]));
    });

    return files;
}

function getAllFilesInElement(element) {
    var files = element.files;
    var dirs = element.dirs;
    var mods = element.mods;
    var elements = element.elements;

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

function scanNestedLevels(levels) {
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

function fileInfo(filename) {
    var baseName = filename.split('/').slice(-1)[0];
    var baseNameParts = baseName.split('.');
    var stat = fs.statSync(filename);
    var suffix = baseNameParts.slice(1).join('.');
    var isDirectory = stat.isDirectory();
    var info = {
        name: baseName,
        fullname: filename,
        suffix: suffix,
        mtime: stat.mtime.getTime(),
        isDirectory: isDirectory
    };

    return isDirectory ? vfs.listDir(filename)
        .then(function (list) {
            return vow.all(list.map(function (file) {
                return fileInfo(path.join(filename, file));
            }));
        })
        .then(function (files) {
            info.files = files;

            return info;
        })
        :
        new vow.Promise(function (resolve) {
            resolve(info);
        });
}

function scanSimpleLevels(levels) {
    return vow.all(levels.map(function (level) {
            return vfs.listDir(level.path)
                .then(function (list) {
                    return vow.all(list.map(function (filename) {
                        return fileInfo(path.join(level.path, filename));
                    }));
                });
        }))
        .then(function (lists) {
            return Array.prototype.concat.apply([], lists)
                .filter(function (fileInfo) {
                    return fileInfo.name.charAt(0) !== '.';
                });
        });
}

exports.scanSimpleLevels = scanSimpleLevels;
exports.scanNestedLevels = scanNestedLevels;
