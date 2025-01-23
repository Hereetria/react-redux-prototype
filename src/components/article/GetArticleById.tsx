import React, { useEffect, useState } from "react";
import { AppDispatchType, RootStateType } from "../../store/Store.tsx";
import { useDispatch, useSelector } from "react-redux";
import {
  getError,
  getLoading,
  fetchArticleById,
  ArticleActionTypes,
} from "../../store/slices/ArticleSlice.tsx";
import { useParams } from "react-router-dom";

type GetArticleType = {
  title: string;
  content: string;
};

const GetArticleById: React.FC = () => {
  const dispatch = useDispatch<AppDispatchType>();
  const { articleId } = useParams<{ articleId: string }>();

  const article = useSelector((state: RootStateType) =>
    state.articles.articles.find((article) => article.id === articleId)
  );

  const loading = useSelector((state: RootStateType) =>
    getLoading(state.articles, ArticleActionTypes.FETCH_ARTICLE_BY_ID))

  const error = useSelector((state: RootStateType) =>
    getError(state.articles, ArticleActionTypes.FETCH_ARTICLE_BY_ID))

  const [mappedArticle, setMappedArticle] = useState<GetArticleType | null>(null);

  useEffect(() => {
    if (articleId) {
      dispatch(fetchArticleById(articleId));
    }
  }, [dispatch, articleId]);

  useEffect(() => {
    if (article) {
      const mappedData: GetArticleType = {
        title: article.title,
        content: article.content
      };
      setMappedArticle(mappedData);
    } else {
      setMappedArticle(null);
    }
  }, [article]);

  return (
    <div className="entityContainer">
      <h1>Article</h1>
      {loading ? (
        <p>Loading...</p>
      ) : mappedArticle ? (
        <>
          <div>
            <label>Title: </label>
            <div>{mappedArticle.title}</div>
          </div>
          <div>
            <label>Content: </label>
            <div>{mappedArticle.content}</div>
          </div>
        </>
      ) : (
        error && <p style={{ color: "red" }}>{error.message}</p>
      )}
    </div>
  );
};

export default GetArticleById;