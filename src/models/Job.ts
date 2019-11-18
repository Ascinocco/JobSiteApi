import {Sequelize} from 'sequelize';

interface JobIFace {
  readonly id: number;
  readonly consumerId: number;
  workerId?: number;
  title: string;
  description: string;
  dueDate?: number;
  bid?: number;
  status?: string;
}

export default class Job {
  protected readonly id: number;
  protected readonly consumerId: number;
  protected workerId: number;
  protected title: string;
  protected description: string;
  protected dueDate: number;
  protected bid: number;
  protected status: string;
  private readonly sequelize: Sequelize;

  constructor(jobData: JobIFace, sequelize: Sequelize) {
    this.id           = jobData.id;
    this.consumerId   = jobData.consumerId;
    this.workerId     = jobData.workerId;
    this.title        = jobData.title;
    this.description  = jobData.description;
    this.dueDate      = jobData.dueDate;
    this.bid          = jobData.bid;
    this.status       = jobData.status;
    this.sequelize    = sequelize;
  }
}
