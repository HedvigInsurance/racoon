import { useEffect, useRef } from 'react'

export const useActiveSectionChangeListener = (
  sectionsId: Array<string>,
  callback: (activeSectionId: string) => void,
) => {
  // Used to determine if user is scrolling up
  const scrollPositionRef = useRef(0)

  useEffect(() => {
    const instersectionObserverCb = (entries: Array<IntersectionObserverEntry>) => {
      entries.forEach((entry) => {
        const id = entry.target.id
        const diff = scrollPositionRef.current - window.scrollY
        const isScrollingUp = diff > 0

        if (isScrollingUp) {
          if (!entry.isIntersecting) {
            const activeSectionIndex = sectionsId.findIndex((sectionId) => sectionId === id)
            const previousSectionId = sectionsId[activeSectionIndex - 1]
            if (previousSectionId) {
              callback(previousSectionId)
              scrollPositionRef.current = window.scrollY
            }
          }
        } else {
          if (entry.isIntersecting) {
            callback(id)
            scrollPositionRef.current = window.scrollY
          }
        }
      })
    }

    const observer = new IntersectionObserver(instersectionObserverCb, {
      // Observe only the top 15% of the screen
      rootMargin: '0% 0% -85% 0%',
    })
    sectionsId.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [sectionsId, callback])
}
