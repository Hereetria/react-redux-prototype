import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatchType, RootStateType } from "../../store/Store.tsx";
import {
  getError,
  getLoading,
  fetchUserById,
  updateUser,
  UserActionTypes,
} from "../../store/slices/UserSlice.tsx";
import { useParams } from "react-router-dom";

export type UpdateUserType = {
  id: string;
  username: string;
  password: string;
};

const UpdateUser: React.FC = () => {
  const dispatch = useDispatch<AppDispatchType>();
  const { userId } = useParams<{ userId: string }>();

  const user = useSelector((state: RootStateType) =>
    state.users.users.find((user) => user.id === userId)
  );

  const fetchLoading = useSelector((state: RootStateType) =>
    getLoading(state.users, UserActionTypes.FETCH_USER_BY_ID)
  );
  const updateLoading = useSelector((state: RootStateType) =>
    getLoading(state.users, UserActionTypes.UPDATE_USER)
  );

  const fetchError = useSelector((state: RootStateType) =>
    getError(state.users, UserActionTypes.FETCH_USER_BY_ID)
  );

  const updateError = useSelector((state: RootStateType) =>
    getError(state.users, UserActionTypes.UPDATE_USER)
  );

  const [mappedUser, setMappedUser] = useState<UpdateUserType | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setMappedUser({
        id: user.id,
        username: user.username,
        password: user.password,
      });
    } else {
      setMappedUser(null);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (mappedUser) {
      setMappedUser({
        ...mappedUser,
        [name]: value,
      });
    }
  };

  const handleFormSubmit = async () => {
    if (mappedUser) {
      dispatch(updateUser({ id: mappedUser.id, body: mappedUser }));
    }
  };

  return (
    <div>
      <h1>Update User</h1>
      {fetchLoading ? (
        <p>Loading...</p>
      ) : mappedUser ? (
        <>
          <div>
            <label>Username: </label>
            <input
              type="text"
              name="username"
              value={mappedUser.username}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Password: </label>
            <input
              type="text"
              name="password"
              value={mappedUser.password}
              onChange={handleInputChange}
            />
          </div>

          <button onClick={handleFormSubmit} disabled={updateLoading}>
            {updateLoading ? "Updating..." : "Submit"}
          </button>
        </>
      ) : (
        fetchError && <p style={{ color: "red" }}>{fetchError.message}</p>
      )}
      {updateError && <p style={{ color: "red" }}>{updateError.message}</p>}
    </div>
  );
};

export default UpdateUser;
