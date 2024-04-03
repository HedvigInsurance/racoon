const { storyblokInit, apiPlugin } = require('@storyblok/js')

// DOTENV_CONFIG_PATH=.env.local yarn node -r dotenv/config ./scripts/storyblok-fetch-stories.cjs > stories.json

const main = async () => {
  const { storyblokApi } = storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  })

  if (!storyblokApi) throw new Error('Storyblok API not initialized')

  const stories = []
  let total = Number.MAX_VALUE
  let page = 1
  while (stories.length < total) {
    const { data, headers } = await storyblokApi.getStories({ version: 'published', page })
    total = headers.total
    stories.push(...data.stories)
    page += 1
  }
  process.stdout.write(JSON.stringify(stories, null, 2))
}

main()
