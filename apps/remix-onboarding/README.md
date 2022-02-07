# Remix Web Onboarding

- [Remix Docs](https://remix.run/docs)

## Differences from Next.js setup

### i18n / Translations

Remix doesn't have built-in support for i18n. However, we can still achieve the same functionalities without too much work:

- A root-level `$locale` route parameter scopes all routes. To avoid having to specify the locale in each link we could create a wrapper `<Link>` component.
- `remix-i18next` is used to handle translations. The API is very similar to the Next.js equivalent. However, there's no need for a `default` locale nor do we need to borther with any uppercase/lowercase issues. We just define our routes/locales like we want to. This reduces quite a lot of uninteded complexity.
- Since Remix uses SSR for all routes, we can fetch all translations upfront in `root.tsx` so it's available to all routes automatically. There's no tradeoff like it would be in Next.js.
- The one caveat is if we want to parse markdown string on a route-by-route basis. Then we have to refetch the translations for the routes the use markdown translations.

### Co-location

It's possible to co-locate utility components/hooks inside the `routes` folder by using the `ignoredRouteFiles` property of the Remix config. We should probably explore if this is a good idea.

### Apollo / GraphQL

It still remains to be seen if we don't need to use fetch any data from GraphQL client-side. It will be especially interesting to see how well we will manage without a client-side Apollo cache. Remix should be able to use the browser cache and detect when to rerun data fetches. If so, it would remove a lot of the complexity around that which exists in the Next.js setup.

Currently, the Remix implementation only uses Apollo in SSR mode and on the server. No hooks are used. This means that we have to right some more boilerplate code when typing out data fetching functions.

### Cookies

Dealing with cookies feels much more explicit compared to Next.js. This makes it somewhat harder to abstract away from the rest of the app. I suppose we could still use things like `js-cookie` but I almost get the feeling that Remix is discourcing that implicit approach.

### Environment variables

Remix doesn't have any built-in support for environment variables which is a bit surprising. The official guide still recommends it but it requires some more boilerplate to set it up. I think this is a sign of a maturing framework. The end result is slight more explicit but I still which the framework built-in support for it.

### Performance optimizations

Two common things people miss from Next.js are the optimized `<Script>` and `<Image>` components. I've read the Remix is looking into this but currently there's no official support. Unclear what impact they have on the overall site experience.

### Analytics

One question left to solve is how to log client side page views to GTM.

### JavaScript disabled

It's entierly likely to build a site that works even without JS in Remix. In Next.js it would require a very strict strategy to accomplish.

### Error handling

I haven't integrated Sentry yet. Hopefully that integration is going to be less painful than in Next.js.

However, Remix does seems to do a better job of hand-holding developers to avoid ending up with a blank page after a critical crash.

### Middleware

Middlewares offer a great way to separate concern in Next.js. However, it all comes down to being able to execute code before a request reaches your site. Since Remix is always running in SSR-mode, we should be able to accomplish the same things although we might struggle to separate concern properly.

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```
