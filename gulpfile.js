"use strict";
exports.__esModule = true;
var fs = require("fs");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var path_1 = require("path");
var PATCHES = [];
var BASE_PATH = __dirname + "/../src/app/";
var ANGULAR_JSON = JSON.parse(fs.readFileSync(__dirname + "/../angular.json", 'utf8'));
var CONFIG = JSON.parse(fs.readFileSync(__dirname + "/editor-config.json", 'utf8'));
var writeToJson = new rxjs_1.Subject();
// Подписка необходима для того что бы
writeToJson.pipe(operators_1.debounceTime(200)).subscribe(function () {
    if (ANGULAR_JSON.projects === null || ANGULAR_JSON.projects === undefined) {
        return;
    }
    Object.keys(ANGULAR_JSON.projects).forEach(function (key) {
        if (CONFIG.configurationKeys.indexOf(key) !== -1) {
            CONFIG.projectTypes.forEach(function (type) {
                ANGULAR_JSON.projects[key].architect.build.configurations[type].fileReplacements = PATCHES;
            });
        }
    });
    fs.writeFile(__dirname + "/../angular.json", JSON.stringify(ANGULAR_JSON), function (err) {
        if (err) {
            throw err;
        }
        console.log('angular.json file has been saved!');
    });
});
// Читает дерриктории и список файлов
function readDir(path) {
    // список дериктории в Дериктории ${path}
    fs.readdirSync(path)
        .filter(function (f) { return fs.statSync(path_1.join(path, f)).isDirectory(); })
        .forEach(function (dirName) {
        readDir("" + path + dirName + "/");
    });
    if (path === BASE_PATH) {
        return;
    }
    // список файлов в Дериктории ${path}
    var files = fs.readdirSync(path).filter(function (f) { return fs.statSync(path_1.join(path, f)).isFile(); });
    files.forEach(function (baseFileName) {
        if (baseFileName.search(/\.m/g) === -1) {
            // Регулярка для того что бы вырезать из файла .ts и т.д
            var endOfStringRegExp = new RegExp('\\w+$', 'g');
            var endOfStringStartNumber = baseFileName.search(endOfStringRegExp);
            var endOfString = baseFileName.slice(endOfStringStartNumber);
            // Если файл то записываем .m типы
            var mobileFileName = baseFileName.replace(endOfStringRegExp, "m." + endOfString);
            if (files.indexOf(mobileFileName) > 0) {
                writeToArray(getPath(path, baseFileName), getPath(path, mobileFileName));
            }
        }
    });
}
// Записывает в масив реплейсов
function writeToArray(baseFileName, mobileFileName) {
    PATCHES.push({
        replace: baseFileName,
        "with": mobileFileName
    });
    writeToJson.next();
}
function getPath(path, fileName) {
    return ("" + path + fileName).replace(BASE_PATH, 'src/app/');
}
// Отправная точка
readDir(BASE_PATH);
