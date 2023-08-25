import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLoaderData } from 'react-router-dom';
import { getPostsAll } from '../../api/postsApi';
import RouteNames from '../../router/RouteNames';
import { formatPosts } from '../../services/postService';
import store from '../../store';
import { auxActions } from '../../store/aux/auxStore';
import ForumPage from './ForumPage';

function ForumHomePage() {
  const dispatch = useDispatch();
  const postsLoader = useLoaderData();

  const [posts, setPosts] = useState(postsLoader);

  const [showPostForm, setShowPostForm] = useState(false);

  const formattedPosts = formatPosts(posts);

  async function reloadPosts() {
    try {
      dispatch(auxActions.setLoading(true));
      const posts = await loader();
      setPosts(posts);
      setShowPostForm(false);
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(auxActions.setLoading(false));
    }
  }

  return (
    <ForumPage
      posts={formattedPosts}
      reloadPosts={reloadPosts}
      initialSelectedPage={RouteNames.FORUM_HOME}
    />
  );
}

export default ForumHomePage;

export async function loader() {
  try {
    store.dispatch(auxActions.setLoading(true));

    const response = await getPostsAll();

    return response.data;
  } catch (e) {
    console.error(e);
  } finally {
    store.dispatch(auxActions.setLoading(false));
  }
  return [];
}
