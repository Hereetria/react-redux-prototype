import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatchType, RootStateType } from "../../store/Store.tsx";
import { createUser, getError, getLoading, UserActionTypes } from "../../store/slices/UserSlice.tsx";

export type CreateUserType = {
  username: string;
  password: string; 
}

const CreateUser: React.FC = () => {
  const dispatch = useDispatch<AppDispatchType>();

  const loading = useSelector((state: RootStateType) =>
    getLoading(state.users, UserActionTypes.CREATE_USER))

  const error = useSelector((state: RootStateType) =>
    getError(state.users, UserActionTypes.CREATE_USER))
  
  

  const [user, setUser] = useState<CreateUserType>({
    username: "",
    password: ""
  });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleFormSubmit = async () => {
    dispatch(createUser(user));
  }

  return (
    <div>
      <h1>Create User</h1>
      <div>
        <label>Username: </label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Password: </label>
        <input
          type="text"
          name="password"
          value={user.password}
          onChange={handleInputChange}
        />
      </div>

      <button onClick={handleFormSubmit} disabled={loading}>
        {loading ? "Creating..." : "Submit"}
      </button>

      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
};

export default CreateUser;
