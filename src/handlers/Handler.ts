import {Sequelize} from "sequelize";

export default class Handler {
  protected sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }
}