var path = require('path');

function getName(file) {
    return file.name.split('.')[0];
}

function getLevel(file, levels) {
    var fullname;

    levels.forEach(function (level) {
        if (~file.fullname.indexOf(level.path)) {
            fullname = level.path;
        }
    });

    if (!fullname) {
        fullname = path.dirname(file.fullname);
    }

    return {
        name: fullname.split('/').pop(),
        fullname: fullname
    };
}

function getBemNotation(file) {
    var name = getName(file);
    var block = name.split('__')[0];
    var elem = name.split('__')[1];
    var mod;
    var modKey;
    var modValue;
    var elemMod;
    var elemModKey;
    var elemModValue;

    if (block) {
        modKey = block.split('_')[1];
        modValue = block.split('_')[2];

        if (modKey) {
            mod = {
                key: modKey
            };

            if (modValue) {
                mod.value = modValue;
            }
        }

        block = block.split('_')[0];
    }

    if (elem) {
        elemModKey = elem.split('_')[1];
        elemModValue = elem.split('_')[2];

        if (elemModKey) {
            elemMod = {
                key: elemModKey
            };

            if (elemModValue) {
                elemMod.value = elemModValue;
            }
        }

        elem = elem.split('_')[0];
    }

    return {
        block: block,
        mod: mod,
        elem: elem,
        elemMod: elemMod
    };
}

function buildBemNestedPathByBemNotation(notation) {
    var buf = [notation.block];

    if (notation.mod) {
        if (notation.mod.key) {
            buf.push('_' + notation.mod.key);
        }
    }

    if (notation.elem) {
        buf.push('__' + notation.elem);
    }

    if (notation.elemMod) {
        if (notation.elemMod.key) {
            buf.push('_' + notation.elemMod.key);
        }
    }

    return path.join.apply(null, buf);
}

function buildBemFullNameByBemNotation(notation) {
    var buf = [notation.block];

    if (notation.mod) {
        if (notation.mod.key) {
            buf.push('_' + notation.mod.key);
        }

        if (notation.mod.value) {
            buf.push('_' + notation.mod.value);
        }
    }

    if (notation.elem) {
        buf.push('__' + notation.elem);
    }

    if (notation.elemMod) {
        if (notation.elemMod.key) {
            buf.push('_' + notation.elemMod.key);
        }

        if (notation.elemMod.value) {
            buf.push('_' + notation.elemMod.value);
        }
    }

    return buf.join('');
}

function buildBemNestedPath(file) {
    var notation = getBemNotation(file);

    return buildBemNestedPathByBemNotation(notation);
}

function buildBemFullName(file) {
    var notation = getBemNotation(file);

    return buildBemFullNameByBemNotation(notation);
}

exports.getName = getName;
exports.getLevel = getLevel;
exports.getBemNotation = getBemNotation;
exports.buildBemNestedPath = buildBemNestedPath;
exports.buildBemFullName = buildBemFullName;

exports.getFileInfo = function (file, levels) {
    var notation = getBemNotation(file);

    return {
        name: getName(file),
        level: levels && getLevel(file, levels),
        bem: {
            notation: getBemNotation(file),
            nestedPath: buildBemNestedPathByBemNotation(notation),
            fullName: buildBemFullNameByBemNotation(notation)
        }
    };
};
