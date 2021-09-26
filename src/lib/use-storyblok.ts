import type { StoryblokPageItem } from './types';

import { useEffect, useState } from 'react'

export default function useStoryblok(originalStory: StoryblokPageItem, preview: boolean = false) {
  const [story, setStory] = useState(originalStory)

  function initEventListeners() {
    // @ts-ignore - Storyblok doesn't have types for this
    const { StoryblokBridge } = window
    if (typeof StoryblokBridge !== "undefined") {
      // initialize the bridge with your token
      const storyblokInstance = new StoryblokBridge({
        accessToken: process.env.NEXT_PUBLIC_STORYBLOK_PREVIEW_API_TOKEN,
      });

      // reload on Next.js page on save or publish event in the Visual Editor
      storyblokInstance.on(["change", "published"], () => location.reload());

      // live update the story on input events
      // @ts-ignore - Storyblok doesn't have types for this
      storyblokInstance.on("input", (event) => {
        if (event.story.content._uid === story.content._uid) {
          setStory(event.story);
        }
      });
    }
  }

  // appends the bridge script tag to our document
  // see https://www.storyblok.com/docs/guide/essentials/visual-editor#installing-the-storyblok-js-bridge
  function addBridge(callback: () => void) {
    // check if the script is already present
    const existingScript = document.getElementById("storyblokBridge");
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "//app.storyblok.com/f/storyblok-v2-latest.js";
      script.id = "storyblokBridge";
      document.body.appendChild(script);
      script.onload = () => {
        // once the scrip is loaded, init the event listeners
        callback();
      };
    } else {
      callback();
    }
  }

  useEffect(() => {
    if (preview) {
      // first load the bridge, then initialize the event listeners
      addBridge(initEventListeners);
    }
  });

  return story;
}
