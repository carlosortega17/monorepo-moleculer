const MongoDbMixin = require('../mixins/mongodb.mixin');
const actions = require('../actions');

module.exports = {
  name: 'tasks',
  mixins: [MongoDbMixin('tasks')],
  settings: {
    fields: [
      '_id',
      'title',
      'description',
      'createdAt',
      'updatedAt',
    ],
    entityValidator: {
      title: {
        type: 'string',
        convert: true,
        optional: false,
      },
      description: {
        type: 'string',
        convert: true,
        optional: false,
      },
    },
    populates: {},
    hooks: {
      before: {
        update(ctx) {
          return this._get(ctx, {
            id: ctx.params._id || ctx.params.id,
            fields: [
              '_id',
              'title',
              'description',
              'createdAt',
              'updatedAt',
            ],
          });
        },
      },
    },
  },
  actions,
};
