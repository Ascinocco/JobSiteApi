import { Model } from "objection";
import Job from './Job';

export default class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'firstName',
        'lastName',
        'email',
        'password',
        'isConsumer',
        'isWorker',
      ],
      properties: {
        id: {type: 'integer'},
        isConsumer: {type: 'boolean'},
        isWorker: {type: 'worker'},
        firstName: {type: 'string', minLength: 1, maxLength: 255},
        lastName: {type: 'string', minLength: 1, maxLength: 255},
        age: {type: 'number'},
        address: {
          type: 'object',
          properties: {
            country: {type: 'string'},
            street: {type: 'string'},
            city: {type: 'string'},
            zipPostalCode: {type: 'string'}
          }
        }
      },
    };
  }

  static get relationMappings() {
    return {
      consumerJobs: {
        relation: Model.HasManyRelation,
        modelClass: Job,
        join: {
          from: 'users.id',
          to: 'jobs.consumerId'
        }
      },
      workerJobs: {
        relation: Model.HasManyRelation,
        modelClass: Job,
        join: {
          from: 'users.id',
          to: 'jobs.workerId'
        }
      }
    }
  }
}