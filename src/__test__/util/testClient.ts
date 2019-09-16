import * as rp from "request-promise";
import { CookieJar } from "request";

export class TestClient {
  options: {
    jar: CookieJar;
    withCredentials: boolean;
    json: boolean;
  };

  constructor(public url: string) {
    this.options = {
      withCredentials: true,
      jar: rp.jar(),
      json: true
    };
  }

  async register(email: string, password: string, name: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
        mutation {
          UserRegisterWithEmail(
            input: {
              email: "${email}",
              password: "${password}",
              name: "${name}"
            }
          ) {
            token
            error
            clientMutationId
          }
        }`
      }
    });
  }

  async login(email: string, password: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
        mutation {
          UserLoginWithEmail(
            input: {
              email: "${email}",
              password: "${password}"
            }
          ) {
            token
            error
            clientMutationId
          }
        }`
      }
    });
  }
}
