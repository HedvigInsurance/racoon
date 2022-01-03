# Racoon

Proof of concept monorepo to support all purchase journey related projects.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Yarn v1](https://yarnpkg.com)

### Install Node.js with `nvm`

1. Install `nvm` [https://github.com/creationix/nvm](https://github.com/creationix/nvm)
1. `nvm install` (installs the node version specified in `.nvmrc`)
1. `nvm use` (use version from `.nvmrc`)

### Install dependencies

```sh
yarn
```

### Development

Run the development server:

```sh
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## What's inside?

This Turborepo includes the following packages and apps:

### Apps & Packages

- `onboarding`: web-based onboarding using Next.js
- `ui`: a dummy React UI library
- `scripts`: ESLint configurations
- `tsconfig`: TypeScript configs used throughout the monorepo

Each package and app is 100% Typescript.

### Setup reference

The setup is based on the Turborepo [`kitchen-sink` template](https://github.com/vercel/turborepo/tree/main/examples/kitchen-sink).

## The name

Raccoons can eat just about anything, making them ideal urban dwellers. They love big city life! Today there are 20 times more of them in cities compared to 70 years ago. They can now be found across the globe.
