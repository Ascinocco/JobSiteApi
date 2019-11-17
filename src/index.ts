import createAppServer, { AppServer } from "./core/createAppServer";
import AuthenticationHandler from "./handlers/AuthenticationHandler";

const run = async () => {
  const appServer: AppServer = await createAppServer();

  // routes
  const authHandler = new AuthenticationHandler(appServer.knex);
  appServer.hapiServer.route(authHandler.routes());

  await appServer.hapiServer.start();
  console.log('Api running on port: ', appServer.hapiServer.info.port);
};


process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

run();
