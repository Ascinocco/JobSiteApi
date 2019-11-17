import {Request, ResponseObjectHeaderOptions} from 'hapi';
import Handler from "./Handler";

// @TODO: implement token refresh handler
export default class AuthenticationHandler extends Handler {
  private register = (request: Request, h: ResponseObjectHeaderOptions) => {
    console.log('request', request.payload);
    console.log('h', h);
    return 'register reached';
  };

  private login = (request: Request, h: ResponseObjectHeaderOptions) => {
    console.log('request', request.payload);
    console.log('h', h);
    return 'login reached';
  };

  private logout = (request: Request, h: ResponseObjectHeaderOptions) => {
    console.log('request', request.payload);
    console.log('h', h);
    return 'logout reached';
  };

  public routes() {
    return [
      { method: 'POST', path: '/auth/register', handler: this.register, config: { auth: false } },
      { method: 'POST', path: '/auth/login', handler: this.login, config: { auth: false } },
      { method: 'POST', path: '/auth/logout', handler: this.logout, config: { auth: 'jwt' } }
    ];
  }
}
