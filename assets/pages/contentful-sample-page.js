import { getSampleContent } from '@graphql';

const ContentfulSamplePage = props => {
  console.log('Contentful content: ', props);
  return (
    <div>
      <h1>Contentful Sample Page</h1>
      <p>Open your browser's console to see fetched Contentful content.</p>
    </div>
  );
};

export default ContentfulSamplePage;

export const getStaticProps = async () => {
  const sampleContent = await getSampleContent();
  return {
    props: {
      ...sampleContent
    }
  };
};
