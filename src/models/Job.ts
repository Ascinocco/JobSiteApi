import {Sequelize} from 'sequelize';

export interface JobIFace {
  readonly id: number;
  readonly consumerId: number;
  allowWorkerToAddActionItems?: boolean;
  workerId?: number;
  title: string;
  description: string;
  dueDate?: number;
  bid?: number;
  status?: string;
  address?: string;
}

export default class Job {
  public readonly id: number;
  protected readonly consumerId: number;
  protected workerId: number;
  protected title: string;
  protected description: string;
  protected dueDate: number;
  protected bid: number;
  protected status: string;
  protected address: string;
  protected allowWorkerToAddActionItems: boolean;

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
    this.address      = jobData.address;
    this.allowWorkerToAddActionItems = jobData.allowWorkerToAddActionItems;
    this.sequelize    = sequelize;
  }

  public toJSON = () => {
    return {
      id:           this.id,
      consumerId:   this.consumerId,
      workerId:     this.workerId,
      title:        this.title,
      description:  this.description,
      dueDate:      this.dueDate,
      bid:          this.bid,
      status:       this.status,
      address:      this.address,
      allowWorkerToAddActionItems: this.allowWorkerToAddActionItems,
    };
  };
}
