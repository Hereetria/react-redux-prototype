import { createSlice, AsyncThunk } from "@reduxjs/toolkit";
import { CreateArticleType } from "../../components/article/CreateArticle.tsx";
import { UpdateArticleType } from "../../components/article/UpdateArticle.tsx";
import {
  EntityTypes,
  HttpMethodTypes,
  LoadingErrorState,
} from "../../utils/types.tsx";
import { createAsyncEntityThunk } from "../../utils/AsyncEntityThunkCreator.tsx";
import {
  addEntity,
  deleteEntity,
  setEntity,
  setEntityList,
  setError,
  setPending,
  updateEntity,
} from "../../utils/EntityStateHelpers.tsx";

export enum ArticleActionTypes {
  FETCH_ARTICLES = "FETCH_ARTICLES",
  FETCH_ARTICLE_BY_ID = "FETCH_ARTICLE_BY_ID",
  CREATE_ARTICLE = "CREATE_ARTICLE",
  UPDATE_ARTICLE = "UPDATE_ARTICLE",
  DELETE_ARTICLE = "DELETE_ARTICLE",
}

export type Article = {
  id: string;
  title: string;
  content: string;
};

type ArticleState = LoadingErrorState<ArticleActionTypes> & {
  articles: Article[];
};

const initialState: ArticleState = {
  articles: [],
  loading: {
    [ArticleActionTypes.FETCH_ARTICLES]: false,
    [ArticleActionTypes.FETCH_ARTICLE_BY_ID]: false,
    [ArticleActionTypes.CREATE_ARTICLE]: false,
    [ArticleActionTypes.UPDATE_ARTICLE]: false,
    [ArticleActionTypes.DELETE_ARTICLE]: false,
  },
  error: {
    [ArticleActionTypes.FETCH_ARTICLES]: null,
    [ArticleActionTypes.FETCH_ARTICLE_BY_ID]: null,
    [ArticleActionTypes.CREATE_ARTICLE]: null,
    [ArticleActionTypes.UPDATE_ARTICLE]: null,
    [ArticleActionTypes.DELETE_ARTICLE]: null,
  },
};

export const fetchAllArticles = createAsyncEntityThunk<Article[]>(
  ArticleActionTypes.FETCH_ARTICLES,
  EntityTypes.Articles,
  HttpMethodTypes.GET
);

export const fetchArticleById = createAsyncEntityThunk<Article>(
  ArticleActionTypes.FETCH_ARTICLE_BY_ID,
  EntityTypes.Articles,
  HttpMethodTypes.GET
);

export const createArticle = createAsyncEntityThunk<Article, CreateArticleType>(
  ArticleActionTypes.CREATE_ARTICLE,
  EntityTypes.Articles,
  HttpMethodTypes.POST
);

export const updateArticle = createAsyncEntityThunk<Article, UpdateArticleType>(
  ArticleActionTypes.UPDATE_ARTICLE,
  EntityTypes.Articles,
  HttpMethodTypes.PUT
);

export const deleteArticle = createAsyncEntityThunk<Article>(
  ArticleActionTypes.DELETE_ARTICLE,
  EntityTypes.Articles,
  HttpMethodTypes.DELETE
);

const articleSlice = createSlice({
  name: "article",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handleAsyncAction = <T, P>(
      action: AsyncThunk<T, P, {}>,
      successHandler: (state: ArticleState, payload: T) => void
    ) => {
      const actionType = action.typePrefix as ArticleActionTypes;

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

    handleAsyncAction(fetchAllArticles, (state, payload) =>
      setEntityList(
        state,
        ArticleActionTypes.FETCH_ARTICLES,
        payload,
        EntityTypes.Articles
      )
    );
    handleAsyncAction(fetchArticleById, (state, payload) =>
      setEntity(
        state,
        ArticleActionTypes.FETCH_ARTICLE_BY_ID,
        payload,
        EntityTypes.Articles
      )
    );
    handleAsyncAction(createArticle, (state, payload) =>
      addEntity(
        state,
        ArticleActionTypes.CREATE_ARTICLE,
        payload,
        EntityTypes.Articles
      )
    );
    handleAsyncAction(updateArticle, (state, payload) =>
      updateEntity(
        state,
        ArticleActionTypes.UPDATE_ARTICLE,
        payload,
        EntityTypes.Articles
      )
    );
    handleAsyncAction(deleteArticle, (state, payload) =>
      deleteEntity(
        state,
        ArticleActionTypes.DELETE_ARTICLE,
        payload,
        EntityTypes.Articles
      )
    );
  },
});

export const getLoading = (state: ArticleState, action: ArticleActionTypes) => {
  return state.loading[action];
};

export const getError = (state: ArticleState, action: ArticleActionTypes) => {
  return state.error[action] || null;
};

export default articleSlice.reducer;
