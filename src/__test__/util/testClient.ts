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

  async post(id: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
        {
          post(id: "${id}") {
            _id
            id
            description
            title
            author {
              id
              _id
              name
              email
            }
          }
        }`
      }
    });
  }

  async UserCreatePost(title: string, description: string, token: string) {
    return rp.post(this.url, {
      ...this.options,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        query: `
          mutation {
            UserCreatePost(input: {
              title: "${title}"
              description: "${description}"
            }) {
              error
              post {
                id
                _id
                title
                description
                author {
                  id
                  _id
                  name
                  email
                }
              }
            }
          }`
      }
    });
  }

  async feed(
    after?: string | undefined,
    first?: number | undefined,
    before?: string | undefined,
    last?: number | undefined
  ) {
    const query = `
    {
      feed ${
        after || first || before || last
          ? `(
        ${after ? `after: "${after}"` : ""}
        ${first ? `first: ${first}` : ""}
        ${before ? `before: "${before}"` : ""}
        ${last ? `last: ${last}` : ""}
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
            description
            title
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

  async node(id: string, fields?: string) {
    return rp.post(this.url, {
      ...this.options,
      body: {
        query: `
          {
            node(id: "${id}") {
              id
              ${fields}
            }
          }
        `
      }
    });
  }

  async editPost(id: string, title: string, token: string) {
    return rp.post(this.url, {
      ...this.options,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        query: `mutation {
          EditPost(input: {id: "${id}", title: "${title}"}) {
            post {
              _id
              id
              title
              description
            }
          }
        }`
      }
    });
  }
}
