# Cake 🎂

Cake (**C**ontentful **A**ccelerator **K**it for **E**nterprise) is an accelerator for [Contentful](https://https://www.contentful.com/), built by [DEG](https://www.degdigital.com/). Cake helps get new Contentful projects up and running quickly, and streamlines development once the project is set up.

Specifically, it includes:

- Automated Contentful space, environment and API key creation
- Automated installation and Contentful configuration of the [DEG Next.js Starter](https://github.com/degdigital/deg-nextjs-starter)
- VS Code snippets to accelerate writing migration scripts
- Plop templates to accelerate writing GraphQL queries
- Sample migration scripts and GraphQL queries

Cake works best as an automated scaffolding tool on new projects. However, see [Manual Setup](#) for information on adding it to an existing project or Contentful space.

## Table of Contents

1. Getting Started
2. Additional Configuration
3. Manually Importing the Models

## Getting Started

### Prerequisites

1. Before running Cake, you must have a [Contentful personal access token](https://shorturl.at/uwMQS) and user access to the Organization in which you plan to set up your space.
2. Cake can be run without installation using [npx](https://nodejs.dev/learn/the-npx-nodejs-package-runner). Make sure you're running at least `npm 5.2` to use it.
3. Read the DEG Next.js Starter's [Node Prerequisites](https://github.com/degdigital/deg-nextjs-starter#node-prerequisites) section for tips on installing and automating your Node versions for Next.js projects.

### Installation

1. Navigate in your terminal to the parent directory where you want your project to be installed. For example, if you project should live in `~/Projects/sample-project`, navigate to `~/Projects`.
2. In your terminal, type `npx github:degdigital/cake install [PROJECT-NAME]`. You may be asked to install the package locally; please accept.
3. Cake will say hello! Follow the prompts, which will include entering your personal access token, naming your project, defining which organization you'll use, and setting up multiple environments.
4. Cake will begin its tasks, which includes setting up Contentful, installing the DEG Next.js Starter, and copying over essential files. This can take several minutes.
5. Once Cake finishes, you're ready to use your Contentful-enabled Next.js project! In your terminal, navigate into your new project's directory, and type `npm run dev` to start Next.js in development mode.

### After Installation

Due to limitations in the Contentful CLI, there are a few manual steps you must take after Cake finishes its installation:

### Environment Aliases

Aliases must be manually opted into from the Contentful web interface.

1. In the Contentful web interface, go to `Settings => Environments => Set up your first alias` and follow the instructions to create a `master` alias.
2. It's also recommended to create a development alias. Click `Add environment alias` in the right sidebar, give the alias the name `develop`, set its target environment at `develop`, and click `Add environment alias`.

### Environmental Variables

Inexplicably, the Contentful API gives access to the Content Delivery API access token, but not the Content Preview API access token. Because of this, it must be manually added to your project's environmental variables.

1. In the Contentful web interface, go to `Settings => API Keys` and choose `Primary API Key`.
2. Copy the value of `Content Preview API - access token`.
3. In your project's `.env.local` file, add the copied value to `NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN`.

### VS Code Snippets

Cake adds a `.vscode` directory in your project's codebase containing useful snippets for writing GraphQL queries in Visual Studio Code. Double-check that you can use these Contentful snippets by opening the command menu (`command + shift + P`) and choosing `Insert Snippet`. If you can't:

1. In VS Code, go to `Preferences => User Snippets`.
2. In the menu that pops up, choose `New Snippets file for [projectname]...` and add the file.

## Manually Importing the Models

> **Please note:** If you've run the Cake installer, everything outlined in this section is already set up for you.
>
> By importing a starter model at the beginning of your project (using the [Contentful CLI](https://github.com/contentful/contentful-cli) `import` command), you can seed your new Contentful space with common content types and entries. This can improve your model's reusability and flexibility, and accelerate project development.

The starter models included with Cake are based on commonly reused models, patterns and best practices that have been established by DEG.

To import a starter model into your Contentful space:

1. If you haven't already, [create a new space](https://www.contentful.com/faq/basics/#how-do-i-create-a-space) in the Contentful web interface. Make a note of the space ID.
2. You will need a Personal Access Token. If you haven't already created one, go to `Settings -> API Keys` in the Contentful web interface, go to the `Content management tokens` tab, and click `Generate personal token`.
3. Download the appropriate model JSON file from this repo.
4. In your terminal, navigate to your project directory.
5. Follow the instructions in the [Contentful CLI import documentation](https://github.com/contentful/contentful-cli/tree/master/docs/space/import) to import the JSON starter into your space. In most cases, you'll enter a command similar to `contentful space import --content-file [PATH/TO/starter-model.json] --space-id [SPACE-ID] --management-token [MANAGEMENT-TOKEN]`.
6. You're done! Visit your space in the Contentful web interface, and you should see seeded content types and entries.
