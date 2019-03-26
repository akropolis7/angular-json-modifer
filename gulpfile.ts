declare var __dirname;

import * as fs from 'fs';

import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { join } from 'path';

import { Config } from './commons/interfaces/config.interface';

const PATCHES = [];

const BASE_PATH = `${__dirname}/../src/app/`;
const ANGULAR_JSON = JSON.parse(fs.readFileSync(`${__dirname}/../angular.json`, 'utf8'));
const CONFIG: Config = JSON.parse(fs.readFileSync(`${__dirname}/editor-config.json`, 'utf8'));

const writeToJson = new Subject<void>();

// Подписка необходима для того что бы
writeToJson.pipe(debounceTime(200)).subscribe(() => {
  if (ANGULAR_JSON.projects === null || ANGULAR_JSON.projects === undefined) {
    return;
  }

  Object.keys(ANGULAR_JSON.projects).forEach((key: string) => {
    if (CONFIG.configurationKeys.indexOf(key) !== -1) {
      CONFIG.projectTypes.forEach(type => {
        ANGULAR_JSON.projects[key].architect.build.configurations[type].fileReplacements = PATCHES;
      });
    }
  });

  fs.writeFile(`${__dirname}/../angular.json`, JSON.stringify(ANGULAR_JSON), (err) => {
    if (err) {
      throw err;
    }

    console.log('angular.json file has been saved!');
  });
});

// Читает дерриктории и список файлов
function readDir(path: string): void {
  // список дериктории в Дериктории ${path}
  fs.readdirSync(path)
    .filter(f => fs.statSync(join(path, f)).isDirectory())
    .forEach(dirName => {

      readDir(`${path}${dirName}/`);
    });

  if (path === BASE_PATH) {
    return;
  }

  // список файлов в Дериктории ${path}
  const files = fs.readdirSync(path).filter(f => fs.statSync(join(path, f)).isFile());

  files.forEach(baseFileName => {
    if (baseFileName.search(/\.m/g) === -1) {
      // Регулярка для того что бы вырезать из файла .ts и т.д
      const endOfStringRegExp = new RegExp('\\w+$', 'g');
      const endOfStringStartNumber = baseFileName.search(endOfStringRegExp);
      const endOfString = baseFileName.slice(endOfStringStartNumber);

      // Если файл то записываем .m типы
      const mobileFileName = baseFileName.replace(endOfStringRegExp, `m.${endOfString}`);

      if (files.indexOf(mobileFileName) > 0) {
        writeToArray(getPath(path, baseFileName), getPath(path, mobileFileName));
      }
    }
  });
}

// Записывает в масив реплейсов
function writeToArray(baseFileName: string, mobileFileName: string): void {
  PATCHES.push({
    replace: baseFileName,
    with: mobileFileName,
  });

  writeToJson.next();
}

function getPath(path: string, fileName: string): string {
  return `${path}${fileName}`.replace(BASE_PATH, 'src/app/');
}

// Отправная точка
readDir(BASE_PATH);
