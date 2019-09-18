// tslint:disable
// graphql typescript definitions

declare namespace GQL {
interface IGraphQLResponseRoot {
data?: IQuery | IMutation | ISubscription;
errors?: Array<IGraphQLResponseError>;
}

interface IGraphQLResponseError {
/** Required for all errors */
message: string;
locations?: Array<IGraphQLResponseErrorLocation>;
/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
[propName: string]: any;
}

interface IGraphQLResponseErrorLocation {
line: number;
column: number;
}

/**
 * The root of all... queries
 */
  interface IQuery {
__typename: "Query";

/**
 * Fetches an object given its ID
 */
node: Node | null;
me: IUser | null;
user: IUser | null;
users: IUserConnection | null;
}

interface INodeOnQueryArguments {

  /**
   * The ID of an object
   */
id: string;
}

interface IUserOnQueryArguments {
id: string;
}

interface IUsersOnQueryArguments {
after?: string | null;
first?: number | null;
before?: string | null;
last?: number | null;
search?: string | null;
}

/**
 * An object with an ID
 */
  type Node = IUser;

/**
 * An object with an ID
 */
  interface INode {
__typename: "Node";

/**
 * The id of the object.
 */
id: string;
}

/**
 * User data
 */
  interface IUser {
__typename: "User";

/**
 * The ID of an object
 */
id: string;
_id: string | null;
name: string | null;
email: string | null;
active: boolean | null;
}

/**
 * A connection to a list of items.
 */
  interface IUserConnection {
__typename: "UserConnection";

/**
 * Number of items in this connection
 */
count: number;

/**
 * A count of the total number of objects in this connection, ignoring pagination.
*   This allows a client to fetch the first five objects by passing "5" as the
*   argument to "first", then fetch the total count so it could display "5 of 83",
*   for example.
 */
totalCount: number;

/**
 * Offset from start
 */
startCursorOffset: number;

/**
 * Offset till end
 */
endCursorOffset: number;

/**
 * Information to aid in pagination.
 */
pageInfo: IPageInfoExtended;

/**
 * A list of edges.
 */
edges: Array<IUserEdge | null>;
}

/**
 * Information about pagination in a connection.
 */
  interface IPageInfoExtended {
__typename: "PageInfoExtended";

/**
 * When paginating forwards, are there more items?
 */
hasNextPage: boolean;

/**
 * When paginating backwards, are there more items?
 */
hasPreviousPage: boolean;

/**
 * When paginating backwards, the cursor to continue.
 */
startCursor: string | null;

/**
 * When paginating forwards, the cursor to continue.
 */
endCursor: string | null;
}

/**
 * An edge in a connection.
 */
  interface IUserEdge {
__typename: "UserEdge";

/**
 * The item at the end of the edge
 */
node: IUser;

/**
 * A cursor for use in pagination
 */
cursor: string;
}

interface IMutation {
__typename: "Mutation";
UserChangePassword: IUserChangePasswordPayload | null;
UserLoginWithEmail: IUserLoginWithEmailPayload | null;
UserRegisterWithEmail: IUserRegisterWithEmailPayload | null;
}

interface IUserChangePasswordOnMutationArguments {
input: IUserChangePasswordInput;
}

interface IUserLoginWithEmailOnMutationArguments {
input: IUserLoginWithEmailInput;
}

interface IUserRegisterWithEmailOnMutationArguments {
input: IUserRegisterWithEmailInput;
}

interface IUserChangePasswordInput {
oldPassword: string;

/**
 * user new password
 */
password: string;
clientMutationId?: string | null;
}

interface IUserChangePasswordPayload {
__typename: "UserChangePasswordPayload";
error: string | null;
me: IUser | null;
clientMutationId: string | null;
}

interface IUserLoginWithEmailInput {
email: string;
password: string;
clientMutationId?: string | null;
}

interface IUserLoginWithEmailPayload {
__typename: "UserLoginWithEmailPayload";
token: string | null;
error: string | null;
clientMutationId: string | null;
}

interface IUserRegisterWithEmailInput {
name: string;
email: string;
password: string;
clientMutationId?: string | null;
}

interface IUserRegisterWithEmailPayload {
__typename: "UserRegisterWithEmailPayload";
token: string | null;
error: string | null;
clientMutationId: string | null;
}

interface ISubscription {
__typename: "Subscription";
UserAdded: IUserAddedPayload | null;
}

interface IUserAddedPayload {
__typename: "UserAddedPayload";
userEdge: IUserEdge | null;
}
}

// tslint:enable
