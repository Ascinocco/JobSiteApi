import {Request, ResponseObjectHeaderOptions} from 'hapi';

import User, {UserIFace} from "../models/User";
import ActionItem, {ActionItemIFace} from "../models/ActionItem";
import Job, {JobIFace} from '../models/Job';
import Handler from './Handler';
import Response from "./Response";

interface ActionItemPayload {
  order: number;
  text: string;
}

interface CreateJobPayload {
  id?: number;
  consumerId?: number;
  workerId?: number;
  allowWorkerToAddActionItems?: boolean;
  title: string;
  description: string;
  dueDate?: number;
  bid?: number;
  status?: string;
  actionItems?: Array<ActionItemPayload>;
}

export default class JobHandler extends Handler {
  public routes() {
    return [
      { method: 'GET', path: '/jobs', handler: this.list, config: { auth: 'jwt' } },
      { method: 'POST', path: '/jobs', handler: this.createJob, config: { auth: 'jwt' } },
      { method: 'PATCH', path: '/jobs/{jobId}', handler: this.updateJob, config: { auth: 'jwt' } }
    ];
  };

  private list = async (request: Request, h: ResponseObjectHeaderOptions) => {
    return 'list';
  };

  private createJob = async (request: Request, h: ResponseObjectHeaderOptions) => {
    try {
      // @TODO: optimize, create single sql function to handle job creation
      // @ts-ignore
      const id: number = request.auth.credentials.id;
      const payload: CreateJobPayload = <CreateJobPayload> request.payload;
      const { actionItems, ...coreJobData } = payload;

      let columns = '';
      let values = '';
      const keys = Object.keys(coreJobData);

      keys.forEach((k, i) => {
        if ((i + 1) === keys.length) {
          columns += `"${k}"`;
          values += `:${k}`;
        } else {
          columns += `"${k}",`;
          values += `:${k},`;
        }
      });

      const [[ jobData ]] = await this.sequelize.query(`INSERT INTO jobs (${columns},"consumerId") VALUES (${values},:consumerId) RETURNING *;`, {
        replacements: {
          ...coreJobData,
          consumerId: id,
        }
      });


      const job = new Job(<JobIFace> jobData, this.sequelize);
      console.log('job', job.toJSON());

      const actionItemObjects = [];
      if (actionItems.length) {
        let values = '';
        actionItems.forEach((item: ActionItemPayload, i) => {
          if ((i + 1) === actionItems.length) {
            values += `(?, ?, ?)`
          }
          else {
            values += `(?, ?, ?),`;
          }
        });

        const query = `INSERT INTO action_items ("jobId", "order", "text") VALUES ${values} RETURNING *;`;
        const replacementValues = [];
        actionItems.forEach(i => {
          replacementValues.push(job.id);
          replacementValues.push(i.order);
          replacementValues.push(i.text);
        });
        const [ actionItemsFromDb ] = await this.sequelize.query(query, {
          replacements: replacementValues,
        });


        actionItemsFromDb.forEach(i => {
          actionItemObjects.push(new ActionItem(<ActionItemIFace> i).toJSON());
        });
      }

      // console.log('job', job);

      return Response({
        body: {
          job: {
            ...job.toJSON(),
            actionItems: [...actionItemObjects],
          }
        }
      });
    }
    catch (err) {
      console.log('err', err);
      return Response({
        err,
        body: {}
      });
    }
  };

  private updateJob = async () => {
    return 'update';
  };
}
