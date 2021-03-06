import {Request, ResponseObjectHeaderOptions} from 'hapi';

import User, {UserIFace} from '../models/User';
import Handler from "./Handler";
import Response from "./Response";

interface AccountDetails {
  firstName?: string;
  lastName?: string;
  email?: string;
  isConsumer?: boolean;
  isWorker?: boolean;
  age?: number;
  country?: string;
  city?: string;
  zipPostalCode?: string;
  notifyMeIfJobsInRange?: boolean;
  maxDistance?: number;
  distanceUnit?: string;
}

export default class UserHandler extends Handler {
  public routes() {
    return [
      { method: 'GET', path: '/me', handler: this.me, config: { auth: 'jwt' } },
      // { method: 'POST', path: '/me/change-password', handler: this.requestChangePassword, config: { auth: 'jwt' } },
      // { method: 'PATCH', path: '/me/change-password', handler: this.changePassword, config: { auth: 'jwt' } },
      { method: 'PATCH', path: '/me/details', handler: this.updateProfileDetails, config: { auth: 'jwt' } },
      // { method: 'PATCH', path: '/me/profile-image', handler: this.changeProfileImage, config: { auth: 'jwt' } },
      // { method: 'DELETE', path: '/me', handler: this.deleteAccount, config: { auth: 'jwt' } },
    ];
  }

  private me = async (request: Request, h: ResponseObjectHeaderOptions) => {
    try {
      // @ts-ignore
      const id: number = request.auth.credentials.id;
      const [[ user ]] = await this.sequelize.query('SELECT * FROM users WHERE id = :id', {
        replacements: {
          id,
        }
      });

      return Response({
        body: {
          user: new User(<UserIFace> user, this.sequelize),
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

  // private requestChangePassword = async () => {
  // //  @TODO: send email with pw reset token.
  // };
  //
  // private changePassword = async () => {
  // //  @TODO: change password logic
  // };

  private updateProfileDetails = async (request: Request, h: ResponseObjectHeaderOptions) => {
    try {
      // @ts-ignore
      const id: number = request.auth.credentials.id;
      const payload: AccountDetails = <AccountDetails> request.payload;
      console.log('payload', payload);
      const query = `UPDATE users SET ${Object.keys(payload).map(k => `"${k}" = :${k}`)} WHERE id = :id RETURNING *;`;

      const [[ user ]] = await this.sequelize.query(query, {
        replacements: {
          ...payload,
          id
        },
      });

      return Response({
        body: {
          user: new User(<UserIFace> user, this.sequelize),
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

  // private changeProfileImage = async () => {};
  // private deleteAccount = async () => {};
}