var path = require('path');
var util = require('util');
var vow = require('vow');
var vfs = require('enb/lib/fs/async-fs');

function symlink(sourcePath, targetPath) {
    var dir = path.dirname(targetPath);

    return vfs.makeDir(dir)
        .then(function () {
            return vfs.exists(targetPath);
        })
        .then(function (isExists) {
            if (isExists) {
                return vfs.remove(targetPath);
            }
        })
        .then(function () {
            var relativeSourcePath = path.relative(targetPath, sourcePath);

            return vfs.symLink(relativeSourcePath, targetPath);
        });
}

function build(dstpath, files, levels, resolve) {
    return vfs.makeDir(dstpath)
        .then(function () {
            var hash = {};
            var targets = [];

            files.map(function (file) {
                var solutions = resolve(file, levels, dstpath);

                if (solutions) {
                    if (!util.isArray(solutions)) {
                        if (typeof solutions === 'string') {
                            solutions = [{ sourcePath: file.fullname, targetPath: solutions }];
                        } else {
                            solutions = [solutions];
                        }
                    }

                    solutions.forEach(function (solution) {
                        var targetPath = path.resolve(dstpath, solution.targetPath);

                        targets.push(targetPath);
                        hash[targetPath] = solution.sourcePath;
                    });
                }
            });

            return vow.all(Object.keys(hash).map(function (key) {
                    return symlink(hash[key], key);
                }))
                .then(function () {
                    return targets;
                });
        });
}

exports.build = build;
