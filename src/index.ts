import createAppServer, { AppServer } from "./core/createAppServer";
import AuthenticationHandler from "./handlers/AuthenticationHandler";
import UserHandler from "./handlers/UserHandler";

const run = async () => {
  const appServer: AppServer = await createAppServer();

  // handlers + routes
  const userHandler = new UserHandler(appServer.sequelize);
  const authHandler = new AuthenticationHandler(
    appServer.sequelize,
    appServer.createToken,
  );
  appServer.hapiServer.route([
    ...userHandler.routes(),
    ...authHandler.routes(),
  ]);

  await appServer.hapiServer.start();
  console.log('Api running on port: ', appServer.hapiServer.info.port);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

run();
