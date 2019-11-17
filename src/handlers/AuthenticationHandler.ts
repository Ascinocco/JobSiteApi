import EmailValidator from 'email-deep-validator';
import {Request, ResponseObjectHeaderOptions} from 'hapi';
import {transaction} from "objection";

import User from '../models/User';
import Handler from "./Handler";
import Response from "./Response";

interface RegistrationPayload {
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmation: string;
  password: string;
  passwordConfirmation: string;
  isConsumer?: boolean;
  isWorker?: boolean;
  age?: number;
  country?: string; // needs to be required for launch
  street?: string;
  city?: string;
  zipPostalCode?: string;
}

async function validateRegistration(data: RegistrationPayload): Promise<void> {
  if (data.email !== data.emailConfirmation) {
    throw new Error('Emails do not match.');
  }

  const emailValidator = new EmailValidator();
  const { wellFormed, validDomain } = await emailValidator.verify(data.email);

  if (!wellFormed || !validDomain) {
    throw new Error('Invalid email address.');
  }

  if (data.password !== data.passwordConfirmation) {
    throw new Error('Passwords do not match.');
  }

  const pwRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,25}$/;
  if (!pwRegex.test(data.password)) {
    throw new Error('Password strength requirements not met.');
  }
}

// @TODO: implement token refresh handler
export default class AuthenticationHandler extends Handler {
  private register = async (request: Request, h: ResponseObjectHeaderOptions) => {
    try {
      const payload: RegistrationPayload = <RegistrationPayload> request.payload;
      await validateRegistration(payload);
      const user = await transaction(User.knex(), trx => {
        return (
          User.query(trx).insertGraph(payload)
        );
      });
      // console.log('user', user.$toJson());
      return 'temp';
    }
    catch (err) {
      console.log('err', err);
      return Response({
        err,
        body: {}
      });
    }
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
