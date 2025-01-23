import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatchType, RootStateType } from "../../store/Store.tsx";
import { createArticle, getError, getLoading, ArticleActionTypes } from "../../store/slices/ArticleSlice.tsx";

export type CreateArticleType = {
  title: string;
  content: string; 
}

const CreateArticle: React.FC = () => {
  const dispatch = useDispatch<AppDispatchType>();

  const loading = useSelector((state: RootStateType) =>
    getLoading(state.articles, ArticleActionTypes.CREATE_ARTICLE))

  const error = useSelector((state: RootStateType) =>
    getError(state.articles, ArticleActionTypes.CREATE_ARTICLE))
  
  

  const [article, setArticle] = useState<CreateArticleType>({
    title: "",
    content: ""
  });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setArticle((prevArticle) => ({
      ...prevArticle,
      [name]: value
    }));
  };

  const handleFormSubmit = async () => {
    dispatch(createArticle(article));
  }

  return (
    <div>
      <h1>Create Article</h1>
      <div>
        <label>Title: </label>
        <input
          type="text"
          name="title"
          value={article.title}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label>Content: </label>
        <input
          type="text"
          name="content"
          value={article.content}
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

export default CreateArticle;
