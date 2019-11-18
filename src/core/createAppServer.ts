import Hapi from '@hapi/hapi';
import * as HapiTypes from 'hapi';
import jwt2 from 'hapi-auth-jwt2'
import Sequelize, {Sequelize as SequelizeType} from 'sequelize';
import createToken from './createToken';

interface DatabaseConfig {
  database: string;
  username: string;
  password: string;
  host: string;
  dialect: string;
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  }
}

interface HttpServerConfig {
  port: string;
}

interface AppServerConfig {
  routes: object[];
  httpServerConfig: HttpServerConfig;
  databaseConfig: DatabaseConfig;
  secretKey: string;
}

interface UserTokenRequiredData {
  id: number;
  email: string;
}

export interface AppServer {
  hapiServer: HapiTypes.Server;
  sequelize: SequelizeType,
  createToken(id: number, email: string): string;
}

const buildServerConfig = (config: AppServerConfig): AppServerConfig => ({
  secretKey: config?.secretKey || 'devSecretSoSecretUdontKnowIt10394!',
  routes: config?.routes || [],
  httpServerConfig: {
    port: config?.httpServerConfig?.port || '3000',
  },
  databaseConfig: {
    database: config?.databaseConfig?.database || 'jobsiteapidb',
    username: config?.databaseConfig?.username || 'anthony',
    password: config?.databaseConfig?.password || 'password',
    host: config?.databaseConfig?.host || 'localhost',
    dialect: config?.databaseConfig?.dialect || 'postgres',
    pool: {
      max: config?.databaseConfig?.pool?.max || 5,
      min: config?.databaseConfig?.pool?.min || 0,
      acquire: config?.databaseConfig?.pool?.acquire || 30000,
      idle: config?.databaseConfig?.pool?.idle || 10000,
    },
  }
});

export default async function createAppServer(appServerConfig?: AppServerConfig) {
  const config = buildServerConfig(appServerConfig);

  // @ts-ignore
  const sequelize: SequelizeType = new Sequelize(
    config.databaseConfig.database,
    config.databaseConfig.username,
    config.databaseConfig.password,
    {
      host: config.databaseConfig.host,
      dialect: config.databaseConfig.dialect,
      pool: config.databaseConfig.pool,
      define: {
        timestamps: true,
      }
    }
  );

  const hapiServer = Hapi.server(config.httpServerConfig);
  await hapiServer.register(jwt2);

  hapiServer.auth.strategy('jwt', 'jwt', {
    key: config.secretKey,
    validate: async function(decoded, request, h) {
      if (decoded.exp < new Date().getTime() / 1000) {
        // expired
        return { isValid: false };
      }

      return { isValid: true };
    }
  });
  hapiServer.auth.default('jwt');

  return {
    hapiServer,
    sequelize,
    createToken: createToken(config.secretKey),
  };
};
