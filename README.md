![](https://raw.githubusercontent.com/toggledtech/.github/main/profile/And%20Change%20the%20World.png)

# Design Something Great... In seconds
With Toggled creating a beautiful website has never been easier.

Toggled allows you to make beautiful websites with Markdown or HTML or both. Toggled also integrates directly into your favorite work environments such as GitHub and Replit.

Visit our [starter repository](https://github.com/toggledtech/Toggled-Starter) to get started today.

[Try Toggled Today](https://toggled.tech)

# Using The Toggled CLI

Use this to design, develop, and deploy packages, addons, and more for Toggled.tech. This is intended for use of advanced developers only.

## Getting Started

Install it with:

```bash 
npm i toggled-cli
```

### toggled.json

The first step to designing anything with the Toggled CLI is creating a toggled.json file.

You can do this by running the following command in the terminal.

```bash
toggled init package
```

This will create a new toggled.json file with the type set to package.

### Package Code

Design the custom elements in the file set as `main` in toggled.json.

```js
export const BLOCKNAME = (e) => {
  //e is the parent element of the block access dataset via e.dataset
  const blockCode = `<p>Hello World</p>`;

  return blockCode;
};
```

You must return the block in an HTML format readable by the browser.

### Deployment

There are two ways to deploy your custom blocks. If you want full control over hosting then you can host it on your own servers statically. Then import it like this:

```js
import { BLOCKNAME } from 'https://your-server.com/your-file.js'
```

Your server must be https and configured for CORS. See https://toggled.tech/site/toggledtech-docs/Imports.

---

The other option it to deploy it directly from the CLI to our servers. This won't give you as much control but you will not have to worry about hosting.

Deploy it by running this command in terminal.

```bash
toggled package
```

Then import it like this:

```js
import { BLOCKNAME } from 'PACKAGE_NAME'
```

Your package name is specified as `name` in toggled.json. (Note even if the name has uppercases, the server will always make it lowercase)