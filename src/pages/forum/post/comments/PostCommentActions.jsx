import { Button, ButtonGroup } from 'react-bootstrap';
import { t } from '../../../../i18n/translate';
import ForumPostVote from '../../posts/ForumPostVote';
import styles from './PostCommentActions.module.css';

function PostCommentActions({
  post,
  comment,
  upvotes,
  downvotes,
  onReply,
  onUpdate,
}) {
  return (
    <div className={styles.container}>
      <ForumPostVote
        postId={post.id}
        commentId={comment.id}
        upvotes={upvotes}
        downvotes={downvotes}
        className={styles.vote}
        onUpdate={onUpdate}
      />
      <ButtonGroup className={styles.actions}>
        <Button className={styles.actionButton} onClick={onReply}>
          {t('REPLY')}
        </Button>
        <Button className={styles.actionButton}>{t('SHARE')}</Button>
        <Button className={styles.actionButton}>{t('TIP')}</Button>
        <Button className={styles.actionButton}>{'...'}</Button>
      </ButtonGroup>
    </div>
  );
}

export default PostCommentActions;
