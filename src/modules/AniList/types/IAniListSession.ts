import { IAniListUser } from './IAniListUser';

export interface IAniListSession {
  /**
   * @var {string} accessToken contains the access token of the current session
   */
  accessToken: string;
  /**
   * @var {IAniListUser} user contains the data of the currently logged in user
   */
  user: IAniListUser;
}
