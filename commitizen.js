'use strict';

module.exports = {
  types: [
    {
      value: 'build',
      name: 'build:     Building a project or changing external dependencies',
    },
    { value: 'docs', name: 'docs:      Documentation only changes' },
    { value: 'feat', name: 'feat:      A new feature' },
    { value: 'fix', name: 'fix:       A bug fix' },
    { value: 'hotfix', name: 'hotfix:    A hot bug fix' },
    { value: 'test', name: 'test:      Tests only changes' },
  ],

  // Область. Она характеризует фрагмент кода, которую затронули изменения
  scopes: [
    { name: 'components' },
    { name: 'tutorial' },
    { name: 'catalog' },
    { name: 'product' },
    { name: 'package.json' },
    { name: 'readme' },
    { name: 'casl' },
    { name: 'auth' },
    { name: 'user' },
    { name: 'health' },
    { name: 's3' },
    { name: 'sqs' },
    { name: 'core' },
    { name: 'serialize' },
    { name: 'validation' },
  ],

  scopeOverrides: {
    test: [{ name: 'style' }, { name: 'e2eTest' }, { name: 'unitTest' }],
  },

  // Поменяем дефолтные вопросы
  messages: {
    type: 'What changes are you making?',
    customScope: 'Specify your OBLIGATION:',
    body: 'Write an EXACT description (optional). Use "|" for a new line:\n',
    footer: 'A place for meta data (tickets, links, and the rest):\n',
    confirmCommit: 'Are you happy with the resulting commit?',
  },
  allowCustomScopes: true,
  allowBreakingChanges: false,

  // Префикс для нижнего колонтитула
  footerPrefix: 'META DATA:',

  // limit subject length
  subjectLimit: 72,
};
