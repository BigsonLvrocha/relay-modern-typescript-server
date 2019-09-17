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

  async changePassword(
    oldPassword: string,
    newPassword: string,
    token: string
  ) {
    return rp.post(this.url, {
      ...this.options,
      headers: {
        "x-access-token": `Bearer ${token}`
      },
      body: {
        query: `
        mutation {
          UserChangePassword(
            input: {
              oldPassword: "${oldPassword}",
              password: "${newPassword}"
            }
          ) {
            me {
              id
              name
              email
              _id
            }
            error
            clientMutationId
          }
        }`
      }
    });
  }

  async me(token: string) {
    return rp.post(this.url, {
      ...this.options,
      headers: {
        "x-access-token": `Bearer ${token}`
      },
      body: {
        query: `
          {
            me {
              _id
              id
              name
              email
            }
          }
        `
      }
    })
  };
}
