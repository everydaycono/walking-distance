import api, { AuthApi } from './base';

export class TestQuery {
  static async testQuery() {
    return AuthApi.post('/api/auth/admin');
  }
}
