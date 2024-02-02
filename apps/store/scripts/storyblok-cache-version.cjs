const { storyblokInit, apiPlugin } = require('@storyblok/js')

const main = async () => {
  const { storyblokApi } = storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
  })

  if (!storyblokApi) throw new Error('Storyblok API not initialized')

  const { data } = await storyblokApi.getStory('/se')
  console.log(data.cv)
}

main()
