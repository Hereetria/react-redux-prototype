import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatchType } from './store/Store.tsx';
import { deleteUser } from './store/slices/UserSlice.tsx';
import { deleteArticle } from './store/slices/ArticleSlice.tsx';

const Navbar: React.FC = () => {
    const dispatch = useDispatch<AppDispatchType>();

    const [userId, setUserId] = useState<string>("1")
    const [articleId, setArticleId] = useState<string>("1")

    const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserId(e.target.value);
    };

    const handleUserDelete = async () => {
        try {
          await dispatch(deleteUser(userId));
        } catch (error) {
          console.log("An error occurred while deleting the user:", error);
        }
      };

      const handleArticleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setArticleId(e.target.value);
    };

    const handleArticleDelete = async () => {
        try {
          await dispatch(deleteArticle(articleId));
        } catch (error) {
          console.log("An error occurred while deleting the user:", error);
        }
      };

  return (
 <nav>
  <div className='navContainer'>
      <ul>
      <li>
          <label htmlFor="userId">User ID: </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={handleUserIdChange}
            placeholder="Enter User ID"
          />
        </li>
        <br />
        <li>
          <Link to="/users/get">Get users</Link>
          </li>
        <li>
          <Link to={`/users/getById/${userId}`} >Get User By ID</Link>
        </li>

        <li>
          <Link to="/users/create">Create User</Link>
          </li>
        <li>
          <Link to={`/users/update/${userId}`} >Update User</Link>
        </li>

          <li>
            <button onClick={handleUserDelete}>Sil</button>
          </li>
      </ul>
      <ul>
      <li>
          <label htmlFor="articleId">Article ID: </label>
          <input
            type="text"
            id="articleId"
            value={articleId}
            onChange={handleArticleIdChange}
            placeholder="Enter Article ID"
          />
        </li>
        <br />
        <li>
          <Link to="/articles/get">Get articles</Link>
          </li>
        <li>
          <Link to={`/articles/getById/${articleId}`} >Get Article By ID</Link>
        </li>

        <li>
          <Link to="/articles/create">Create Article</Link>
          </li>
        <li>
          <Link to={`/articles/update/${articleId}`} >Update Article</Link>
        </li>

          <li>
            <button onClick={handleArticleDelete}>Sil</button>
          </li>
      </ul>
      </div>
    </nav>
  )
}

export default Navbar