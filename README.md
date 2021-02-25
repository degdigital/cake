# Contentful Starter Content Models for DEG

This repo contains a collection of DEG starter content models and content entries for [Contentful](https://https://www.contentful.com/).

By importing a starter model at the beginning of your project (using the [Contentful CLI](https://github.com/contentful/contentful-cli) `import` command), you can seed your new Contentful space with common content types and entries. This can improve your model's reusability and flexibility, and accelerate project development.

## Choosing a model

For most web projects at DEG, the [general-purpose-model.json model](https://github.com/degdigital/contentful-starter-content-models/blob/main/general-purpose-model.json) is a good starting point (and let's be honest -- it's the only one we have right now).

## Installation

To install a starter model:

1. If you haven't already, [create a new space](https://www.contentful.com/faq/basics/#how-do-i-create-a-space) in the Contentful web interface. Make a note of the space ID.
2. You will need a Personal Access Token. If you haven't already created one, go to `Settings -> API Keys` in the Contentful web interface, go to the `Content management tokens` tab, and click `Generate personal token`.
3. Download the appropriate model JSON file from this repo and copy it into your project's directory (a `contentful` directory at the root can keep things organized).
4. In your terminal, navigate to your project directory.
5. Follow the instructions in the [Contentful CLI import documentation](https://github.com/contentful/contentful-cli/tree/master/docs/space/import) to import the JSON starter into your space. In most cases, you'll enter a command similar to `contentful space import --content-file [PATH/TO/model.json] --space-id [SPACE-ID] --management-token [MANAGEMENT-TOKEN]`.
6. You're done! Visit your space in the Contentful web interface, and you should see seeded content types and entries.
