import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatchType, RootStateType } from "../../store/Store.tsx";
import { fetchAllUsers, getError, getLoading, UserActionTypes } from "../../store/slices/UserSlice.tsx";

type GetUserListType = {
  id: string;
  username: string;
  password: string;
};

const GetUserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatchType>();
  const { users } = useSelector((state: RootStateType) => state.users);

  const loading = useSelector((state: RootStateType) =>
    getLoading(state.users, UserActionTypes.FETCH_USERS)
  )

  const error = useSelector((state: RootStateType) =>
    getError(state.users, UserActionTypes.FETCH_USERS))
  
  
  const [mappedUsers, setMappedUsers] = useState<GetUserListType[]>([]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users.length > 0) {
      const mappedData = users.map(({ id, username, password }) => ({
        id,
        username,
        password
      }))
      setMappedUsers(mappedData);
    } else {
      setMappedUsers([]);
    }
  }, [users]);

  return (
    <div className="entityContainer">
      <h1>Users</h1>
      {loading ? (
        <p>Loading...</p>
      ) : mappedUsers.length > 0 ? (
        mappedUsers.map((user) => (
          <div key={user.id}>
            <div>
              <label>Username: </label>
              <div>{user.username}</div>
            </div>
            <div>
              <label>Password: </label>
              <div>{user.password}</div>
            </div>
            <br />
          </div>
        ))
      ) : error ? (
        <p style={{ color: "red" }}>{error.message}</p>
      ) : (
        <p>No users available</p>
      )}
    </div>
  );
  
  
};

export default GetUserList;
