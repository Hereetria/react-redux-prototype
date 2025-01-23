export type LoadingErrorState<T extends string> = {
    loading: Record<T, boolean>;
    error: Record<T, { message: string; statusCode?: number } | null>;
  };

export enum HttpMethodTypes {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

export enum EntityTypes {
    Users = "users",
    Articles = "articles"
}