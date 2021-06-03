import { fetchContentful } from '@utils/contentful';

const getSampleContent = async (preview = false) => {
  const siteMetadataContent = await fetchContentful(
    `query {
      siteMetadataCollection(limit: 1, preview: ${preview}) {
        items {
          siteName
        }
      }
    }`,
    preview
  );

  return {
    ...siteMetadataContent?.data?.siteMetadataCollection?.items?.[0]
  };
};

export default getSampleContent;
