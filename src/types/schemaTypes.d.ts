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
randomUser: IUser;
post: IPost | null;
feed: IPostConnection | null;

/**
 * Fetches an object given its ID
 */
node: Node | null;
me: IUser | null;
user: IUser | null;
users: IUserConnection | null;
}

interface IPostOnQueryArguments {
id: string;
}

interface IFeedOnQueryArguments {
first?: number | null;
after?: string | null;
last?: number | null;
before?: string | null;
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
 * User data
 */
  interface IUser {

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
 * An object with an ID
 */
  type Node = IUser | IPost | IComment;

/**
 * An object with an ID
 */
  interface INode {

/**
 * The id of the object.
 */
id: string;
}

interface IPost {
id: string;
_id: string;
title: string;
description: string | null;
authorId: string;
author: IUser;
comments: IPostCommentConnection | null;
}

interface ICommentsOnPostArguments {
first?: number | null;
after?: string | null;
last?: number | null;
before?: string | null;
}

interface IPostCommentConnection {
count: number;
totalCount: number;
startCursorOffset: number;
endCursorOffset: number;
pageInfo: IPageInfoExtended;
edges: Array<IPostCommentEdge | null>;
}

/**
 * Information about pagination in a connection.
 */
  interface IPageInfoExtended {

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

interface IPostCommentEdge {
node: IComment | null;
cursor: string | null;
}

interface IComment {
id: string;
_id: string;
authorId: string;
postId: string | null;
comment: string;
author: IUser;
post: IPost;
}

interface IPostConnection {
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
edges: Array<IPostEdge | null>;
}

/**
 * An edge in a connection.
 */
  interface IPostEdge {

/**
 * The item at the end of the edge
 */
node: IPost;

/**
 * A cursor for use in pagination
 */
cursor: string;
}

/**
 * A connection to a list of items.
 */
  interface IUserConnection {

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
 * An edge in a connection.
 */
  interface IUserEdge {

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
CreateComment: ICreateCommentPayload | null;
UserCreatePost: IUserCreatePostPayload | null;
EditPost: IEditPostPayload;
UserChangePassword: IUserChangePasswordPayload | null;
UserLoginWithEmail: IUserLoginWithEmailPayload | null;
UserRegisterWithEmail: IUserRegisterWithEmailPayload | null;
}

interface ICreateCommentOnMutationArguments {
input: ICreateCommentInput;
}

interface IUserCreatePostOnMutationArguments {
input: IUserCreatePostInput;
}

interface IEditPostOnMutationArguments {
input: IEditPostInput;
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

interface ICreateCommentInput {
postId: string;
comment: string;
clientMutationId?: string | null;
}

interface ICreateCommentPayload {
comment: IComment | null;
clientMutationId: string | null;
error: string | null;
}

interface IUserCreatePostInput {
title: string;
description?: string | null;
clientMutationId?: string | null;
}

interface IUserCreatePostPayload {
error: string | null;
post: IPost | null;
clientMutationId: string | null;
}

interface IEditPostInput {
title: string;
id: string;
clientMutationId?: string | null;
}

interface IEditPostPayload {
post: IPost | null;
error: string | null;
clientMutationId: string | null;
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
token: string | null;
error: string | null;
clientMutationId: string | null;
}

interface ISubscription {
UserAdded: IUserAddedPayload | null;
}

interface IUserAddedPayload {
userEdge: IUserEdge | null;
}
}

// tslint:enable
