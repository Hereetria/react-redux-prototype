import React, { useEffect, useState } from "react";
import { AppDispatchType, RootStateType } from "../../store/Store.tsx";
import { useDispatch, useSelector } from "react-redux";
import {
  getError,
  getLoading,
  fetchUserById,
  UserActionTypes,
} from "../../store/slices/UserSlice.tsx";
import { useParams } from "react-router-dom";

type GetUserType = {
  username: string;
  password: string;
};

const GetUserById: React.FC = () => {
  const dispatch = useDispatch<AppDispatchType>();
  const { userId } = useParams<{ userId: string }>();

  const user = useSelector((state: RootStateType) =>
    state.users.users.find((user) => user.id === userId)
  );

  const loading = useSelector((state: RootStateType) =>
    getLoading(state.users, UserActionTypes.FETCH_USER_BY_ID))

  const error = useSelector((state: RootStateType) =>
    getError(state.users, UserActionTypes.FETCH_USER_BY_ID))

  const [mappedUser, setMappedUser] = useState<GetUserType | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      const mappedData: GetUserType = {
        username: user.username,
        password: user.password
      };
      setMappedUser(mappedData);
    } else {
      setMappedUser(null);
    }
  }, [user]);

  return (
    <div className="entityContainer">
      <h1>User</h1>
      {loading ? (
        <p>Loading...</p>
      ) : mappedUser ? (
        <>
          <div>
            <label>Username: </label>
            <div>{mappedUser.username}</div>
          </div>
          <div>
            <label>Password: </label>
            <div>{mappedUser.password}</div>
          </div>
        </>
      ) : (
        error && <p style={{ color: "red" }}>{error.message}</p>
      )}
    </div>
  );
};

export default GetUserById;