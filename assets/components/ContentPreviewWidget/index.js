import PropTypes from 'prop-types';
import { Button } from '@components';
import Tooltip from '@reach/tooltip';
import styles from './ContentPreviewWidget.module.css';

const ContentPreviewWidget = ({ preview }) => {
  const handleExitClick = async () => {
    await fetch('/api/exit-preview');
    if (window?.location) {
      window.location.reload();
    }
  };

  if (!preview) {
    return null;
  }

  return (
    <div className={styles.ContentPreviewWidget}>
      <h2 className={styles.Heading}>
        Preview Mode
        {/* Not sure why, but styles only work when added inline -- can't use CSS Module here */}
        <Tooltip
          label="Preview mode shows Draft and Unpublished content. Only Contentful authors can see this."
          style={{
            backgroundColor: '#333',
            border: 'none',
            borderRadius: '0.25rem',
            color: '#fff',
            fontSize: '0.825rem',
            padding: '0.125rem 0.375rem',
            position: 'absolute',
            zIndex: '9999'
          }}
        >
          <Button className={styles.Tooltip} />
        </Tooltip>
      </h2>
      <Button className={styles.CloseButton} onClick={handleExitClick}>
        Exit Preview Mode
      </Button>
    </div>
  );
};

ContentPreviewWidget.defaultProps = {
  preview: false
};

ContentPreviewWidget.propTypes = {
  preview: PropTypes.bool.isRequired
};

export default ContentPreviewWidget;
