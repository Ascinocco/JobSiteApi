import { Model } from "objection";

export default class Job extends Model {
  static get tableName() {
    return 'jobs';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'title',
        'description',
        'consumerId',
        'dueDate',
        'bid',
      ],
      properties: {
        id: {type: 'integer'},
        consumerId: {type: 'integer'},
        workerId: {type: ['integer', 'null']},
        title: {type: 'string', minLength: 10, maxLength: 255},
        description: {type: 'string'},
        dueDate: {type: 'float'},
        bid: {type: 'float'},
        status: {type: 'string'},
      }
    };
  }
}