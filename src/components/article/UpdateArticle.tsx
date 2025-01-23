import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatchType, RootStateType } from "../../store/Store.tsx";
import {
  getError,
  getLoading,
  fetchArticleById,
  updateArticle,
  ArticleActionTypes,
} from "../../store/slices/ArticleSlice.tsx";
import { useParams } from "react-router-dom";

export type UpdateArticleType = {
  id: string;
  title: string;
  content: string;
};

const UpdateArticle: React.FC = () => {
  const dispatch = useDispatch<AppDispatchType>();
  const { articleId } = useParams<{ articleId: string }>();

  const article = useSelector((state: RootStateType) =>
    state.articles.articles.find((article) => article.id === articleId)
  );

  const fetchLoading = useSelector((state: RootStateType) =>
    getLoading(state.articles, ArticleActionTypes.FETCH_ARTICLE_BY_ID)
  );
  const updateLoading = useSelector((state: RootStateType) =>
    getLoading(state.articles, ArticleActionTypes.UPDATE_ARTICLE)
  );

  const fetchError = useSelector((state: RootStateType) =>
    getError(state.articles, ArticleActionTypes.FETCH_ARTICLE_BY_ID)
  );

  const updateError = useSelector((state: RootStateType) =>
    getError(state.articles, ArticleActionTypes.UPDATE_ARTICLE)
  );

  const [mappedArticle, setMappedArticle] = useState<UpdateArticleType | null>(null);

  useEffect(() => {
    if (articleId) {
      dispatch(fetchArticleById(articleId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (article) {
      setMappedArticle({
        id: article.id,
        title: article.title,
        content: article.content,
      });
    } else {
      setMappedArticle(null);
    }
  }, [article]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (mappedArticle) {
      setMappedArticle({
        ...mappedArticle,
        [name]: value,
      });
    }
  };

  const handleFormSubmit = async () => {
    if (mappedArticle) {
      dispatch(updateArticle({id:mappedArticle.id, body:mappedArticle}));
    }
  };

  return (
    <div>
      <h1>Update Article</h1>
      {fetchLoading ? (
        <p>Loading...</p>
      ) : mappedArticle ? (
        <>
          <div>
            <label>Title: </label>
            <input
              type="text"
              name="title"
              value={mappedArticle.title}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Content: </label>
            <input
              type="text"
              name="content"
              value={mappedArticle.content}
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

export default UpdateArticle;
