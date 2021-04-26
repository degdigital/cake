import { fetchContentful } from '@utils/contentful';

const getSampleContent = async () => {
  const siteMetadataContent = await fetchContentful(
    `query {
      siteMetadataCollection(limit: 1) {
        items {
          siteName
        }
      }
    }`
  );

  return {
    ...siteMetadataContent?.data?.siteMetadataCollection?.items?.[0]
  };
};

export default getSampleContent;
