type Res<T = any> = T extends [...infer U] ? {
    [K in keyof U]: Res<U[K]>;
} : T extends {
    [key: string]: infer U;
} ? {
    [K in keyof T]: Res<T[K]>;
} : T;
type GQLResponse<T> = Promise<Res<T>>;
interface GraphQLClient {
    query<T>(query: string): GQLResponse<T>;
    mutation<T>(query: string): GQLResponse<T>;
}
interface GQLClientOptions {
    headers?: Record<string, string>;
    credentials?: 'omit' | 'same-origin' | 'include';
}
export declare class GQLClient implements GraphQLClient {
    #private;
    private endpoint;
    private options;
    constructor(endpoint: string, options?: GQLClientOptions);
    query<T>(query: string, variables?: Record<string, any>): GQLResponse<T>;
    mutation<T>(query: string, variables?: Record<string, any>): GQLResponse<T>;
}
export {};
