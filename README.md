# Racoon 🦝

Monorepo to for everything related to Hedvig.com.

## Why Racoon?

Raccoons can eat just about anything, making them ideal urban dwellers. They love big city life! Today there are 20 times more of them in cities compared to 70 years ago. They can now be found across the globe.

## Getting Started

### Install Node.js with `nvm`

1. Install `nvm` [https://github.com/creationix/nvm](https://github.com/creationix/nvm)
1. `nvm install` (installs the node version specified in `.nvmrc`)
1. `nvm use` (use version from `.nvmrc`)

### Package manager

We use `yarn` as package manager. [Corepack](https://github.com/nodejs/corepack) installs the specified version defined in `package.json` so you do not need to install it yourself.

### Install project

```sh
git clone https://github.com/HedvigInsurance/racoon
cd racoon
nvm use
yarn
```

### Development

#### Environment variables

Ask someone from the Web domain team to help you out :)

If you're already part of the Vercel-team you can run:

```sh
vercel --scope hedvig link --project hedvig-dot-com --yes
vercel env pull apps/store/.env.local
```

### If you're using VSCode

Follow [this guide](https://yarnpkg.com/getting-started/editor-sdks#vscode) to setup VS Code in order Yarn PnP and Typescript to work accordingly.

#### Run the development server

```sh
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

For deployment, updating translations, using CMS, etc. you will need access tokens. Refer to Notion for setup details.

#### Running a specific package

```sh
yarn dev --filter=store
```

Refer to the Turborepo documentation about [package filtering](https://turborepo.org/docs/core-concepts/filtering) for more details.

## What's inside?

This Turborepo monorepo includes the following packages and apps:

### Apps & Packages

- `store`: Hedvig.com website
- `ui`: Hedvig UI library (React)
- `estlit-config-custom`: ESLint configurations

Every package/app is 100% written in Typescript.

Below is an up-to-date visualization of the files and folders that make up the repository:

![Repo visualization diagram](https://github.com/hedviginsurance/racoon/blob/assets/repo-diagram.svg)

### Setup reference

The setup is based on the Turborepo [`kitchen-sink` template](https://github.com/vercel/turborepo/tree/main/examples/kitchen-sink).
