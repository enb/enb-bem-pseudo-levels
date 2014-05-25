enb-pseudo-levels [![NPM version](https://badge.fury.io/js/enb-pseudo-levels.svg)](http://badge.fury.io/js/enb-pseudo-levels) [![Build Status](https://travis-ci.org/andrewblond/enb-pseudo-levels.svg?branch=master)](https://travis-ci.org/andrewblond/enb-pseudo-levels) [![Dependency Status](https://gemnasium.com/andrewblond/enb-pseudo-levels.svg)](https://gemnasium.com/andrewblond/enb-pseudo-levels)
=================

Инструмент для манипуляции с уровнями переопределений для ENB. Позволяет создавать уровни на основе уже существующих.

Текущая реализация основана на симлинках. Это означает, что созданный уровень будет состоять из симлинкок на файлы исходных уровней.

Как использовать?
-----------------

Для того, чтобы выполнить манипуляцию над уровнями следует:

1. Задать список исходных уровней, на основе которых будут производиться манипуляции.
2. Задекларировать resolve-функцию по пути до нового уровня.
3. Запустить процесс сборки новых уровней;

Пример того, как скопировать `nested`-уровень и положить его на файловую систему в `simple`-стиле:

```js
var pseudo = require('enb-pseudo-levels');

module.exports = function (config) {

config.task('pseudo', function () {         // Создаём таск с названием `pseudo`,
                                            // в котором будем производить
                                            // манипуляции с уровнями.

    return pseudo(getLevels(config))        // Сканируем исходные уровни.        (1)

        .addBuilder('pseudo-level',         // Задаём путь нового уровня.        (2)

            function resolve(file) {        // resolve-функция определяет
                return file.name;           // пути до новых файлов относительно
            }                               // 'pseudo-level'

        )
        .build();                           // Строим новый уровень              (3)
});

};

function getLevels(config) {
    return [
        'source-level'
    ].map(function (level) {
        return config.resolvePath(level);
    });
}
```

Запускаем скрипт манипуляции с уровнями следует описанный в таске `pseudo`:

```bash
$ ./node_modules/.bin/enb make pseudo
```

Установка
----------

```
npm install --save-dev enb-pseudo-levels
```

Для работы модуля требуется зависимость от пакета enb версии 0.8.22 или выше.

Разработка
----------
Руководство на [отдельной странице](/CONTRIBUTION.md).
