import PropTypes from 'prop-types';
import '../styles/globals.css';
import { ContentPreviewWidget } from '@components';

const App = ({ Component, pageProps }) => {
  const { preview } = pageProps;

  return (
    <>
      <ContentPreviewWidget preview={preview} />
      <Component {...pageProps} />
    </>
  );
};

App.propTypes = {
  Component: PropTypes.node,
  pageProps: PropTypes.object
};

export default App;
