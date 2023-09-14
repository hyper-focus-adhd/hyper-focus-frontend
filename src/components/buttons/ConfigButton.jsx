import { Button } from 'react-bootstrap';
import { BsGear } from 'react-icons/bs';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { t } from '../../i18n/translate';
import styles from './ConfigButton.module.css';
import IconButton from './IconButton';

function ConfigButton({ onClick }) {
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const navigate = useNavigate();

  if (isMobile) {
    return (
      <IconButton
        className={styles.button}
        icon={<BsGear style={{ fontSize: '20px', color: 'primary' }} />}
        onClick={onClick}
      />
    );
  }

  return (
    <Button
      className={styles.button}
      variant="outline-primary"
      type="button"
      onClick={onClick}
    >
      <BsGear style={{ fontSize: '20px', marginRight: '4px' }} />
      {t('CONFIGURATIONS')}
    </Button>
  );
}

export default ConfigButton;
