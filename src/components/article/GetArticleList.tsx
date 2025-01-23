import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatchType, RootStateType } from "../../store/Store.tsx";
import { getError, getLoading, fetchAllArticles, ArticleActionTypes } from "../../store/slices/ArticleSlice.tsx";

type GetArticleListType = {
  id: string;
  title: string;
  content: string;
};

const GetArticleList: React.FC = () => {
  const dispatch = useDispatch<AppDispatchType>();
  const { articles } = useSelector((state: RootStateType) => state.articles);

  const loading = useSelector((state: RootStateType) =>
    getLoading(state.articles, ArticleActionTypes.FETCH_ARTICLES)
  )

  const error = useSelector((state: RootStateType) =>
    getError(state.articles, ArticleActionTypes.FETCH_ARTICLES))
  
  
  const [mappedArticles, setMappedArticles] = useState<GetArticleListType[]>([]);

  useEffect(() => {
    dispatch(fetchAllArticles());
  }, [dispatch]);

  useEffect(() => {
    if (articles.length > 0) {
      const mappedData = articles.map(({ id, title, content }) => ({
        id,
        title,
        content
      }))
      setMappedArticles(mappedData);
    } else {
      setMappedArticles([]);
    }
  }, [articles]);

  return (
    <div className="entityContainer">
      <h1>Articles</h1>
      {loading ? (
        <p>Loading...</p>
      ) : mappedArticles.length > 0 ? (
        mappedArticles.map((article) => (
          <div key={article.id}>
            <div>
              <label>Title: </label>
              <div>{article.title}</div>
            </div>
            <div>
              <label>Content: </label>
              <div>{article.content}</div>
            </div>
            <br />
          </div>
        ))
      ) : error ? (
        error && <p style={{ color: "red" }}>{error.message}</p>
      ) : (
        <p>No articles available</p>
      )}
    </div>
  );
  
};

export default GetArticleList;
