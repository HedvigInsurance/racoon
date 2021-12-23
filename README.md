# Racoon

A prototype.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Develop with Storyblok

- Reference: [Next.js example with Storyblok](https://github.com/vercel/next.js/tree/canary/examples/cms-storyblok)
- Storyblok docs: [Add a headless CMS to Next.js in 5 minutes](https://www.storyblok.com/tp/add-a-headless-cms-to-next-js-in-5-minutes)
- [The Complete Guide to Build a Full Blown Multilanguage Website with Next.js](https://www.storyblok.com/tp/next-js-react-guide)
- [Add a headless CMS to Next.js in 5 minutes](https://www.storyblok.com/tp/add-a-headless-cms-to-next-js-in-5-minutes)
- [CodeSandbox: storyblok/getting-started](https://codesandbox.io/s/github/storyblok/getting-started))

## Develop with Mocked API

[Mock Service Worker](https://mswjs.io/) is an API mocking library for browser and Node. It provides seamless mocking by interception of actual requests on the network level using Service Worker API. This makes your application unaware of any mocking being at place.

### Enable/Disable API Mocking

To enable/disable mocking, all you have to do is add `NEXT_PUBLIC_API_MOCKING=[enabled|disabled]` into `.env.development` file and run the app on development mode - `yarn dev`. Not defining a `NEXT_PUBLIC_API_MOCKING` key will result on disabling API mocking.

### How to define mocks

Information about how to define mocks can be found [here](https://mswjs.io/docs/getting-started/mocks).

## Testing

To run tests just execute `yarn dev`.

## The name

Raccoons can eat just about anything, making them ideal urban dwellers. They love big city life! Today there are 20 times more of them in cities compared to 70 years ago. They can now be found across the globe.

## Todo

- [ ] Integrate with [Storyblok Image Service](https://www.storyblok.com/docs/image-service)
