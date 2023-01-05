# Racoon 🦝

Proof of concept monorepo to support all purchase journey related projects.

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

Ask someone from the Purchase Journey team to help you out :)

If you're already part of the Vercel-team you can run:

```sh
vercel --scope hedvig link --project onboarding --yes
vercel env pull apps/onboarding/.env.local

vercel --scope hedvig link --project hedvig-dot-com --yes
vercel env pull apps/store/.env.local
```

#### Run the development server

```sh
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

For deployment, pulling translations, using CMS, etc you will need access tokens. Refer to Notion for setup details

#### Running a specific package

```sh
yarn dev --filter=store
```

Read more about package filtering in turboreo [here](https://turborepo.org/docs/core-concepts/filtering).

## What's inside?

This Turborepo includes the following packages and apps:

### Apps & Packages

- `onboarding`: web-based onboarding using Next.js
- `store`: Hedvig Coverage Store
- `ui`: Hedvig React UI library
- `scripts`: ESLint configurations
- `tsconfig`: TypeScript configs used throughout the monorepo

Each package and app is 100% Typescript.

Below is an up-to-date visualization of the files and folders that make up the repository:

![Repo visualization diagram](https://github.com/hedviginsurance/racoon/blob/assets/repo-diagram.svg)

### Setup reference

The setup is based on the Turborepo [`kitchen-sink` template](https://github.com/vercel/turborepo/tree/main/examples/kitchen-sink).
