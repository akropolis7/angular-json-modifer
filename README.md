# angular-json-modifer
Angular6 module allows you to modify angular.json of your project for different types of assemblies

Данное приложение позволяет динамически добавлять file-replacements в ваш angular.json файл, для этого необходимо следовать некоторым правилам:
  1: необходимо что бы в дерриктории было 2 файла:
    1.1: foo.component.ts
    1.2: foo.component.m.ts (только в этом случае будет сгенерирован fileReplacements)
