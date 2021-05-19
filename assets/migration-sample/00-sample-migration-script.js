/* Documentation Links:
Migration CLI: https://github.com/contentful/contentful-migration
Fields: https://contentful.com/developers/docs/concepts/data-model/
Content Types: https://contentful.com/developers/docs/references/content-management-api/#/reference/content-types/content-type
Editor Interfaces: https://www.contentful.com/developers/docs/extensibility/app-framework/editor-interfaces/
*/

module.exports.description = 'Migration script description';

module.exports.up = migration => {
  const migrationContentType = migration
    .createContentType('sampleMigrationItem')
    .name('Sample Migration Content Type')
    .description('A sample content type');

  migrationContentType
    .createField('name')
    .type('Symbol')
    .name('Name')
    .required(true);

  migrationContentType
    .createField('slug')
    .type('Symbol')
    .name('Slug')
    .required(true)
    .validations([{ unique: true }]);

  migrationContentType.changeFieldControl('slug', 'builtin', 'slugEditor');

  migrationContentType
    .createField('headline')
    .type('Symbol')
    .name('Headline')
    .required(true);

  migrationContentType
    .createField('description')
    .type('RichText')
    .name('Description')
    .localized(false)
    .required(true)
    .validations([
      {
        enabledMarks: [],
        message: 'Marks are not allowed'
      },
      {
        enabledNodeTypes: ['heading-1', 'hyperlink', 'entry-hyperlink'],
        message: 'Only h1s and links are allowed'
      },

      {
        nodes: {}
      }
    ])
    .disabled(false)
    .omitted(false);

  migrationContentType.displayField('name');
};

module.exports.down = migration => {
  // Add your DOWN migration script here. See examples here:
  // https://github.com/contentful/migration-cli/tree/master/examples
};
