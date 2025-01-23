import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/UserSlice";
import articleReducer from "./slices/ArticleSlice.tsx";

const store = configureStore({
    reducer: {
        users: userReducer,
        articles: articleReducer
    },
});

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatchType = typeof store.dispatch;

export default store;