import { HttpMethodTypes, LoadingErrorState } from "./types.tsx";

export const setPending = <
  S extends LoadingErrorState<string>,
  A extends { type: string }
>(
  state: S,
  action: A
) => {
  const key = action.type;
  state.loading[key] = true;
  state.error[key] = null;
};

export const setError = <
  S extends LoadingErrorState<string>,
  A extends { type: string; payload: unknown }
>(
  state: S,
  action: A
) => {
  const key = action.type;
  state.loading[key] = false;

  if (
    action.payload &&
    typeof action.payload === "object" &&
    "message" in action.payload
  ) {
    state.error[key] = action.payload as { message: string; statusCode?: number };
  } else {
    state.error[key] = { message: `An unknown error occurred with ${key}` };
  }
};

const modifyEntity = <
  S extends LoadingErrorState<string>,
  T extends keyof Omit<S, "loading" | "error">,
  E extends S[T] extends (infer U)[] ? U : never
>(
  state: S,
  actionType: string,
  payload: S[T] | E,
  entityKey: T,
  operation: HttpMethodTypes
) => {
  state.loading[actionType] = false;

  if (!Array.isArray(state[entityKey]) && operation !== HttpMethodTypes.GET) {
    throw new Error(`${String(entityKey)} is not an array`);
  }

  switch (operation) {
    case HttpMethodTypes.GET:
      if (Array.isArray(payload)) {
        state[entityKey] = payload as S[T];
      } else {
        const entityArray = [state[entityKey]] as E[];
        if (
          !entityArray.some(
            (item) => JSON.stringify(item) === JSON.stringify(payload)
          )
        ) {
          entityArray.push(payload as E);
        }
        state[entityKey] = entityArray as S[T];
      }
      break;
    case HttpMethodTypes.POST:
      (state[entityKey] as E[]).push(payload as E);
      break;
    case HttpMethodTypes.PUT: {
      const entityArray = state[entityKey] as E[];
      const index = entityArray.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(payload)
      );
      if (index !== -1) {
        entityArray[index] = payload as E;
      }
      break;
    }
    case HttpMethodTypes.DELETE: {
      const entityArray = state[entityKey] as E[];
      const index = entityArray.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(payload)
      );
      if (index !== -1) {
        entityArray.splice(index, 1);
      }
      break;
    }
  }
};

export const setEntityList = <
  S extends LoadingErrorState<string>,
  T extends keyof Omit<S, "loading" | "error">
>(
  state: S,
  actionType: string,
  payload: S[T],
  entityKey: T
) => modifyEntity(state, actionType, payload, entityKey, HttpMethodTypes.GET);

export const setEntity = <
  S extends LoadingErrorState<string>,
  T extends keyof Omit<S, "loading" | "error">,
  E extends S[T] extends (infer U)[] ? U : never
>(
  state: S,
  actionType: string,
  payload: E,
  entityKey: T
) => modifyEntity(state, actionType, payload, entityKey, HttpMethodTypes.GET);

export const addEntity = <
  S extends LoadingErrorState<string>,
  T extends keyof Omit<S, "loading" | "error">,
  E extends S[T] extends (infer U)[] ? U : never
>(
  state: S,
  actionType: string,
  payload: E,
  entityKey: T
) => modifyEntity(state, actionType, payload, entityKey, HttpMethodTypes.POST);

export const updateEntity = <
  S extends LoadingErrorState<string>,
  T extends keyof Omit<S, "loading" | "error">,
  E extends S[T] extends (infer U)[] ? U : never
>(
  state: S,
  actionType: string,
  payload: E,
  entityKey: T
) => modifyEntity(state, actionType, payload, entityKey, HttpMethodTypes.PUT);

export const deleteEntity = <
  S extends LoadingErrorState<string>,
  T extends keyof Omit<S, "loading" | "error">,
  E extends S[T] extends (infer U)[] ? U : never
>(
  state: S,
  actionType: string,
  payload: E,
  entityKey: T
) => modifyEntity(state, actionType, payload, entityKey, HttpMethodTypes.DELETE);
