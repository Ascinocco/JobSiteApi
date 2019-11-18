import {Sequelize} from 'sequelize';

export interface UserIFace {
  readonly id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  isConsumer: boolean;
  isWorker: boolean;
  //@TODO: All fields will be required in future
  age?: number | string;
  country?: string;
  street?: string;
  city?: string;
  zipPostalCode?: string;
}

export default class User {
  protected readonly id: number;
  protected firstName: string;
  protected lastName: string;
  protected email: string;
  protected password: string;
  protected isConsumer: boolean;
  protected isWorker: boolean;
  protected age: number | string;
  protected country: string;
  protected street: string;
  protected city: string;
  protected zipPostalCode: string;
  private readonly sequelize: Sequelize;

  constructor(userData: UserIFace, sequelize: Sequelize) {
    this.id               = userData.id;
    this.firstName        = userData.firstName;
    this.lastName         = userData.lastName;
    this.email            = userData.email;
    this.password         = userData.password;
    this.isConsumer       = userData.isConsumer;
    this.isWorker         = userData.isWorker;
    this.age              = userData.age;
    this.country          = userData.country;
    this.street           = userData.street;
    this.city             = userData.city;
    this.zipPostalCode    = userData.zipPostalCode;
    this.sequelize        = sequelize;
  }

  public toJSON = () => {
    return {
      id:         this.id,
      firstName:  this.firstName,
      lastName:   this.lastName,
      email:      this.email,
      isConsumer: this.isConsumer,
      isWorker:   this.isWorker,
      age:        this.age,
      country:    this.country,
      street:     this.street,
      city:       this.city,
    }
  }
}
