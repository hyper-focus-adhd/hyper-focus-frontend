import HTMLReactParser from 'html-react-parser';
import { getHoursOrDaysSinceDate } from '../utils';

function formatPosts(posts) {
  let _posts = posts;

  // the order of the next two functions is crucial
  _posts = _getSortedPosts(_posts);
  _posts = _getFormattedPosts(_posts);

  return _posts;
}

function _getFormattedPosts(posts) {
  const remappedPosts = posts.map((post) => formatPost(post));
  return remappedPosts;
}

function formatPost(post) {
  return {
    ...post,
    parsedContent: HTMLReactParser(post.content),
    created_at: getHoursOrDaysSinceDate(post.created_at),
    updated_at: getHoursOrDaysSinceDate(post.updated_at),
  };
}

function _getSortedPosts(posts) {
  return posts.slice().sort((a, b) => {
    const timestampA = new Date(a.created_at);
    const timestampB = new Date(b.created_at);

    if (timestampA < timestampB) {
      return 1;
    }
    if (timestampA > timestampB) {
      return -1;
    }
    return 0;
  });
}

export { formatPost, formatPosts };
