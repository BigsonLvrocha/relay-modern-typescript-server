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
        Authorization: `Bearer ${token}`
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
        Authorization: `Bearer ${token}`
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
    });
  }

  async user(id: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
        {
          user(id: "${id}") {
            _id
            id
            name
            email
          }
        }`
      }
    });
  }

  async users(
    after?: string | undefined,
    first?: number | undefined,
    before?: string | undefined,
    last?: number | undefined,
    search?: string | undefined
  ) {
    const query = `
    {
      users ${
        after || first || before || last
          ? `(
        ${after ? `after: "${after}"` : ""}
        ${first ? `first: ${first}` : ""}
        ${before ? `before: "${before}"` : ""}
        ${last ? `last: ${last}` : ""}
        ${search ? `search: "${search}"` : ""}
      )
      `
          : ""
      }  {
        count
        totalCount
        startCursorOffset
        endCursorOffset
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            _id
            name
            email
          }
          cursor
        }
      }
    }`;
    return rp.post(this.url, {
      ...this.options,
      body: {
        query
      }
    });
  }
}
