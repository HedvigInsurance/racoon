const { storyblokInit, apiPlugin } = require('@storyblok/js')

const main = async () => {
  const { storyblokApi } = storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  })

  if (!storyblokApi) throw new Error('Storyblok API not initialized')

  const { data } = await storyblokApi.getStory('/se', {})
  const cacheVersion = data.cv
  process.stdout.write(`${cacheVersion}\n`)
}

main()
