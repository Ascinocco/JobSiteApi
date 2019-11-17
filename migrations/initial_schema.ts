import Knex from 'knex';

exports.up = (knex: Knex) => {
  return knex.schema
    .createTable('users', table => {
      table.increments('id').primary();
      table.string('firstName');
      table.string('lastName');
      table.string('email');
      table.string('password');
      table.boolean('isConsumer');
      table.boolean('isWorker');
      table.integer('age');
      table.string('country');
      table.string('street');
      table.string('city');
      table.string('zipPostalCode');
    })
    .createTable('jobs', table => {
      table.increments('id').primary();
      table
        .integer('consumerId')
        .unsigned()
        .references('id').inTable('users')
        .onDelete('SET NULL') // @TODO: best way to handle this? cascading delete of all jobs?
        .index();
      table
        .integer('workerId')
        .unsigned()
        .references('id').inTable('users')
        .onDelete('SET NULL')
        .index();
      table.string('title');
      table.string('description');
      table.float('dueDate');
      table.float('bid');
      table.string('status');
    });
};

exports.down = (knex: Knex) => {
  return knex.schema
    .dropTableIfExists('users')
    .dropTableIfExists('jobs');
};
