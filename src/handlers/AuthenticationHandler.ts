import EmailValidator from 'email-deep-validator';
import {Request, ResponseObjectHeaderOptions} from 'hapi';
import Bcrypt from 'bcrypt';
import {Sequelize} from "sequelize";


import User, {UserIFace} from '../models/User';
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
  private createToken;

  constructor(sequelize: Sequelize, createToken) {
    super(sequelize);
    this.createToken = createToken;
  }

  private register = async (request: Request, h: ResponseObjectHeaderOptions) => {
    try {
      const payload: RegistrationPayload = <RegistrationPayload> request.payload;
      await validateRegistration(payload);

      const salt = await Bcrypt.genSalt(10);
      const hash = await Bcrypt.hash(payload.password, salt);

      const query = `
            INSERT INTO users
                    ("id", "firstName", "lastName", "email", "password", "isConsumer",
                     "isWorker", "age", "country", "street", "city", "zipPostalCode")
                     VALUES (DEFAULT, :firstName, :lastName, :email, :password, DEFAULT,
                             DEFAULT, :age, :country, :street, :city, :zipPostalCode);`;

      const options = {
        replacements: {
          firstName:      payload.firstName     || null,
          lastName:       payload.lastName      || null,
          email:          payload.email         || null,
          password:       hash                  || null,
          isConsumer:     payload.isConsumer    || null,
          isWorker:       payload.isWorker      || null,
          age:            payload.age           || null,
          country:        payload.country       || null,    // needs to be required for launch
          street:         payload.street        || null,
          city:           payload.city          || null,
          zipPostalCode:  payload.zipPostalCode || null,
        }
      };
      await this.sequelize.query(query, options);

      const newUser = await this.sequelize.query(
        'SELECT * FROM users WHERE email = :email', {
        replacements: {
          email: payload.email,
        }
      });

      const user = new User(<UserIFace> newUser[0][0], this.sequelize);

      return Response({
        body: {
          user,
          token: this.createToken(user.id, user.email),
        }
      });
    }
    catch (err) {
      console.log('err', err);
      return Response({
        err,
        body: {}
      });
    }
  };

  private me = (request: Request, h: ResponseObjectHeaderOptions) => {
    return 'me!';
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
      { method: 'GET', path: '/me', handler: this.me, config: { auth: 'jwt' } },
      { method: 'POST', path: '/auth/register', handler: this.register, config: { auth: false } },
      { method: 'POST', path: '/auth/login', handler: this.login, config: { auth: false } },
      { method: 'POST', path: '/auth/logout', handler: this.logout, config: { auth: 'jwt' } }
    ];
  }
}
