# angular-json-modifer
Angular6 module allows you to modify angular.json of your project for different types of assemblies

Данное приложение позволяет динамически добавлять file-replacements в ваш angular.json файл, для этого необходимо следовать некоторым правилам:

  1: необходимо что бы в дерриктории было 2 файла:
  
    1.1: foo.component.ts
    
    1.2: foo.component.m.ts (только в этом случае будет сгенерирован fileReplacements)

Настройка `package.json`:

```
"scripts": {
  "json-modifier": "node angular-json-modifer-master/gulpfile.js"
}
```

Настройка `angular-json-modifer-master/editor-config.json`:

configurationKeys - Наименование ваших приложений котрые необходимо учитывать
projectTypes - Набор сборок (Сборку необходимо инициализировать самостоятельно иначе она будет упущенна)

```
{
  "configurationKeys": ["Test1"], // AppName - angular.json/projects.Test1 - Может включать несколько приложений
  "projectTypes": ["production", "production-br"] // angular.json/projects.Test1.architect.build.configurations.production
}
```

Использование:

в консоли из корня проекта выполнить - `npm run cli-modifier & npm run build`

После чего сперва будет сгенерирован и перезаписан angular.json, советую сделать backup, а затем начнется build приложения
