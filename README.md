enb-bem-pseudo-levels
=====================

[![NPM version](http://img.shields.io/npm/v/enb-bem-pseudo-levels.svg?style=flat)](http://badge.fury.io/js/enb-bem-pseudo-levels) [![Build Status](http://img.shields.io/travis/enb-bem/enb-bem-pseudo-levels.svg?branch=master&style=flat)](https://travis-ci.org/enb-bem/enb-bem-pseudo-levels) [![Dependency Status](http://img.shields.io/david/enb-bem/enb-bem-pseudo-levels.svg?style=flat)](https://david-dm.org/enb-bem/enb-bem-pseudo-levels)

Инструмент для манипуляции уровнями переопределений для ENB позволяет создавать уровни на основе уже существующих.

Текущая реализация основана на симлинках. Это означает, что созданный уровень будет состоять из симлинок на файлы исходных уровней.

Установка
----------

```
npm install --save-dev enb-bem-pseudo-levels
```

Для работы модуля требуется зависимость от пакета `enb` версии `0.8.22` или выше.

Как использовать?
-----------------

Для того, чтобы выполнить манипуляцию над уровнями, следует:

1. Задать список исходных уровней, на основе которых будут производиться манипуляции.
2. Задекларировать resolve-функцию по пути до нового уровня.
3. Запустить процесс сборки новых уровней.

Пример того, как скопировать `nested`-уровень и положить его на файловую систему в `simple`-стиле:

```js
var pseudo = require('enb-bem-pseudo-levels');

module.exports = function (config) {

var dstpath = config.resolvePath('pseudo-level');  // путь до нового уровня

// Создаём таск с названием `pseudo`, для манипуляций с уровнями.
config.task('pseudo', function () {
var args = [].slice.call(arguments, 1).map(function (arg) {
    return config.resolvePath(arg);
});                                 // Получаем список целей, которые хотим
                                    // построить в новом уровне. Если список пуст
                                    // уровень будет построен полностью.

return pseudo(getLevels(config))    // Сканируем исходные уровни.    (1)
    .addBuilder(dstpath, resolve)   // Задаём путь и resolve-функцию (2)
    .build(args);                   // Строим новый уровень          (3)
});

};

/**
 * Функция применяется для каждого файла найденного на исходных уровнях `levels`
 *
 * @param file информация о текущем файле
 * @param levels список исходных уровней
 * @param dstpath путь до нового уровня
 */
function resolve (file, levels, dstpath) {
    return [{
        sourcePath: file.fullname,                 // путь до исходного файла
        targetPath: path.join(dstpath, file.name)  // путь до нового файла
    }];
}

function getLevels (config) {
    return [
        'source-level'
    ].map(function (level) {
        return config.resolvePath(level);
    });
}
```

Запускаем описанный в таске скрипт манипуляции с уровнями `pseudo`:

```bash
$ ./node_modules/.bin/enb make pseudo
```

Лицензия
--------

© 2014 YANDEX LLC. Код лицензирован [Mozilla Public License 2.0](LICENSE.txt).
