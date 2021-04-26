const fetchContentful = (query, preview = false) => {
  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
  const environment = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT;
  const previewToken = process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN;
  const deliveryToken =
    process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_ACCESS_TOKEN;

  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${environment}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${preview ? previewToken : deliveryToken}`
      },
      body: JSON.stringify({ query })
    }
  )
    .then(response => response.json())
    .catch(error => console.log('error fetching contentful data', error));
};

export { fetchContentful };
