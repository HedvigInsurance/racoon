# Hedvig-dot-com Blog

## Storyblok

There are two blog-specific content types:

- `blog-article`: defines an article. Designed to conform to a regular `page` content type, but with a few extra fields.

- `blog-article-category`: defines a category of articles. An editor can link one or more categories per `blog-article`.

Additionally, there are two blog-specific blocks which can be added to any story:

- `blogArticleList`: displays a list/grid of articles. Can be filtered by one or more categories.

- `blogArticleCategoryList`: displays a list of categories. An editor is able to select which category should be marked as the "active" one.

## Code components

The `BlogContext` provides access to article teasers (`blogArticleList`) and categories (`blogArticleCategoryList`). The `BlogArticleListBlock` further filters the articles by category if provided.

The context can be preloaded by using the `fetchBlogPageProps` function. It should be run on the server and the result passed to the client. It will read through the blocks of the provided story and fetch the articles and categories as needed.

On the client, `parseBlogContext` accepts page-props and returns the value expected by the `BlogContext` provider.
