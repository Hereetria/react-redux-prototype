import { createSlice, AsyncThunk } from "@reduxjs/toolkit";
import {
  EntityTypes,
  HttpMethodTypes,
  LoadingErrorState,
} from "../../utils/types.tsx";
import { createAsyncEntityThunk } from "../../utils/AsyncEntityThunkCreator.tsx";
import { CreateUserType } from "../../components/user/CreateUser.tsx";
import { UpdateUserType } from "../../components/user/UpdateUser.tsx";
import {
  addEntity,
  deleteEntity,
  setEntity,
  setEntityList,
  setError,
  setPending,
  updateEntity,
} from "../../utils/EntityStateHelpers.tsx";

export enum UserActionTypes {
  FETCH_USERS = "FETCH_USERS",
  FETCH_USER_BY_ID = "FETCH_USER_BY_ID",
  CREATE_USER = "CREATE_USER",
  UPDATE_USER = "UPDATE_USER",
  DELETE_USER = "DELETE_USER",
}

export type User = {
  id: string;
  username: string;
  password: string;
};

type UserState = LoadingErrorState<UserActionTypes> & {
  users: User[];
};

const initialState: UserState = {
  users: [],
  loading: {
    [UserActionTypes.FETCH_USERS]: false,
    [UserActionTypes.FETCH_USER_BY_ID]: false,
    [UserActionTypes.CREATE_USER]: false,
    [UserActionTypes.UPDATE_USER]: false,
    [UserActionTypes.DELETE_USER]: false,
  },
  error: {
    [UserActionTypes.FETCH_USERS]: null,
    [UserActionTypes.FETCH_USER_BY_ID]: null,
    [UserActionTypes.CREATE_USER]: null,
    [UserActionTypes.UPDATE_USER]: null,
    [UserActionTypes.DELETE_USER]: null,
  },
};

export const fetchAllUsers = createAsyncEntityThunk<User[]>(
  UserActionTypes.FETCH_USERS,
  EntityTypes.Users,
  HttpMethodTypes.GET
);

export const fetchUserById = createAsyncEntityThunk<User>(
  UserActionTypes.FETCH_USER_BY_ID,
  EntityTypes.Users,
  HttpMethodTypes.GET
);

export const createUser = createAsyncEntityThunk<User, CreateUserType>(
  UserActionTypes.CREATE_USER,
  EntityTypes.Users,
  HttpMethodTypes.POST
);

export const updateUser = createAsyncEntityThunk<User, UpdateUserType>(
  UserActionTypes.UPDATE_USER,
  EntityTypes.Users,
  HttpMethodTypes.PUT
);

export const deleteUser = createAsyncEntityThunk<User>(
  UserActionTypes.DELETE_USER,
  EntityTypes.Users,
  HttpMethodTypes.DELETE
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handleAsyncAction = <T, P>(
      action: AsyncThunk<T, P, {}>,
      successHandler: (state: UserState, payload: T) => void
    ) => {
      const actionType = action.typePrefix as UserActionTypes;

      builder
        .addCase(action.pending, (state) => {
          setPending(state, { type: actionType });
        })
        .addCase(action.fulfilled, (state, { payload }) => {
          successHandler(state, payload);
        })
        .addCase(action.rejected, (state, { payload }) => {
          setError(state, { type: actionType, payload });
        });
    };

    handleAsyncAction(fetchAllUsers, (state, payload) =>
      setEntityList(state, UserActionTypes.FETCH_USERS, payload, EntityTypes.Users)
    );
    handleAsyncAction(fetchUserById, (state, payload) =>
      setEntity(state, UserActionTypes.FETCH_USER_BY_ID, payload, EntityTypes.Users)
    );
    handleAsyncAction(createUser, (state, payload) =>
      addEntity(state, UserActionTypes.CREATE_USER, payload, EntityTypes.Users)
    );
    handleAsyncAction(updateUser, (state, payload) =>
      updateEntity(state, UserActionTypes.UPDATE_USER, payload, EntityTypes.Users)
    );
    handleAsyncAction(deleteUser, (state, payload) =>
      deleteEntity(state, UserActionTypes.DELETE_USER, payload, EntityTypes.Users)
    );
  },
});

export const getLoading = (state: UserState, action: UserActionTypes) => {
  return state.loading[action];
};

export const getError = (state: UserState, action: UserActionTypes) => {
  return state.error[action] || null;
};

export default userSlice.reducer;
