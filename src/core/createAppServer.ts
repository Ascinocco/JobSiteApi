import Hapi from '@hapi/hapi';
import * as HapiTypes from 'hapi';
import Knex from 'knex';
import jwt2 from 'hapi-auth-jwt2'
import { Model } from 'objection';

interface DatabaseConfig {
  client: string;
  connection: {
    database: string;
    user: string;
    password: string;
  };
  pool: {
    min: number;
    max: number;
  };
}

interface HttpServerConfig {
  port: string;
  hostname: string;
}

interface AppServerConfig {
  routes: object[];
  httpServerConfig: HttpServerConfig;
  databaseConfig: DatabaseConfig;
  secretKey: string;
}

export interface AppServer {
  hapiServer: HapiTypes.Server;
  knex: Knex;
}

const buildServerConfig = (config: AppServerConfig): AppServerConfig => ({
  secretKey: config.secretKey || 'devSecretSoSecretUdontKnowIt10394!',
  routes: config.routes || [],
  httpServerConfig: {
    port: config.httpServerConfig.port || '3000',
    hostname: config.httpServerConfig.hostname || 'localhost',
  },
  databaseConfig: {
    client: config.databaseConfig.client || 'postgres',
    connection: {
      database: config.databaseConfig.connection.database || 'jobsiteapidb',
      user: config.databaseConfig.connection.user || 'anthony',
      password: config.databaseConfig.connection.password || 'password',
    },
    pool: {
      min: config.databaseConfig.pool.min || 2,
      max: config.databaseConfig.pool.max || 10,
    }
  }
});

export default async function createAppServer(appServerConfig?: AppServerConfig) {
  const config = buildServerConfig(appServerConfig);
  console.log('SERVER -- CONFIG -- :', config);

  // Knex db + config
  const knex = Knex(config.databaseConfig);
  knex.migrate.latest();
  Model.bind(knex);

  const hapiServer = Hapi.server(appServerConfig.httpServerConfig);
  await hapiServer.register(jwt2);

  hapiServer.auth.strategy('jwt', 'jwt', {
    key: appServerConfig.secretKey,
    validate: async function(decoded, request, h) {
      console.log('validate running....');
      console.log('decoded', decoded);
      console.log('decoded.id', decoded.id);
      console.log('request', request);
      console.log('h', h);
      console.log('....................');
      // @TODO: token decoded id
      // make db call.
      // check if creds are valid
      // return appropriately
      if (true) {
        return { isValid: true };
      }

      return { isValid: false };
    }
  });
  hapiServer.auth.default('jwt');

  return {
    hapiServer,
    knex,
  };
};
