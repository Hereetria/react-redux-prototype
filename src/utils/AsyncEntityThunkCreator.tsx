import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import processApiError from "./ProcessApiError.tsx";
import { EntityTypes, HttpMethodTypes } from "./types.tsx";
const apiBaseUrl: string = "http://localhost:3000";

const delay = (): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, 500));
};

const processError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const apiError = processApiError(error);
    return { message: apiError.message, statusCode: apiError.statusCode };
  } else if (error instanceof Error) {
    return { message: error.message || "An unexpected error occurred" };
  } else {
    return { message: "An unknown error occurred" };
  }
};

const axiosRequest = async <R, T>(
  url: string,
  method: HttpMethodTypes,
  requestData?: T
): Promise<R> => {
  switch (method) {
    case HttpMethodTypes.GET:
      return (await axios.get<R>(url)).data;
    case HttpMethodTypes.POST:
      return (await axios.post<R>(url, requestData)).data;
    case HttpMethodTypes.PUT:
      return (await axios.put<R>(url, requestData)).data;
    case HttpMethodTypes.DELETE:
      return (await axios.delete<R>(url)).data;
    default:
      throw new Error("Invalid HTTP method");
  }
};

const handleParams = <T,>(
  params: T | number | string | { body: T; id?: string | number } | undefined,
  endpoint: EntityTypes
): { url: string; requestBody?: T } => {
  let url = `${apiBaseUrl}/${endpoint}`;
  let requestBody: T | undefined = undefined;

  if (typeof params === "number" || typeof params === "string") {
    url += `/${params}`;
  } else if (params && typeof params === "object" && "body" in params) {
    const { body, id } = params as { body: T; id?: string | number };
    if (id) {
      url += `/${id}`;
    }
    requestBody = body;
  } else if (params !== undefined) {
    requestBody = params;
  }

  return { url, requestBody };
};

export const createAsyncEntityThunk = <R, T = {}>(
  actionType: string,
  endpoint: EntityTypes,
  method: HttpMethodTypes
) => {
  return createAsyncThunk(
    actionType,
    async (
      params: T | number | string | { body: T; id?: string | number } | undefined,
      thunkAPI
    ) => {
      try {
        await delay();
        const { url, requestBody } = handleParams(params, endpoint);
        const data = await axiosRequest<R, T>(url, method, requestBody);
        return data;
      } catch (error: unknown) {
        const processedError = processError(error);
        return thunkAPI.rejectWithValue(processedError);
      }
    }
  );
};
