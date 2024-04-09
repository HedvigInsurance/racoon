'use client'
import styled from '@emotion/styled'
import { storyblokEditable, renderRichText, type ISbRichtext } from '@storyblok/react'
import { atom, useAtom, useSetAtom } from 'jotai'
import { createJSONStorage, atomWithStorage } from 'jotai/utils'
import { useEffect, useCallback } from 'react'
import { Banner } from '@/components/Banner/Banner'
import type { BannerVariant } from '@/components/Banner/Banner.types'
import type { SbBaseBlockProps } from '@/services/storyblok/storyblok'

export type AnnouncementBlockParams = {
  id: string
  content: ISbRichtext
  variant?: BannerVariant
}
export type AnnouncementBlockProps = SbBaseBlockProps<AnnouncementBlockParams> & {
  className?: string
}

export const AnnouncementBlock = ({ blok, className }: AnnouncementBlockProps) => {
  const { announcements, addAnnouncement, dismissAnnouncement } = useAnnouncements()

  const handleClose = useCallback(() => {
    dismissAnnouncement(blok.id)
  }, [blok.id, dismissAnnouncement])

  useEffect(() => {
    addAnnouncement({
      id: blok.id,
      content: renderRichText(blok.content),
      variant: blok.variant ?? 'info',
    })
  }, [blok, addAnnouncement])

  const matchedAnnouncement = announcements.find((announcement) => announcement.id === blok.id)
  if (!matchedAnnouncement) return null

  return (
    <Banner
      className={className}
      variant={matchedAnnouncement.variant}
      handleClose={handleClose}
      {...storyblokEditable(blok)}
    >
      <Content dangerouslySetInnerHTML={{ __html: matchedAnnouncement.content }} />
    </Banner>
  )
}

const Content = styled.span({
  a: {
    textDecoration: 'underline',
  },
})

type Announcement = {
  id: string
  content: string
  variant?: BannerVariant
}

const PERSISTED_DISMISSED_ANNOUNCEMENTS = atomWithStorage<Array<string>>(
  'dismissedAnnouncements',
  [],
  createJSONStorage(() => sessionStorage),
)

const ANNOUNCEMENTS_ATOM = atom<Array<Announcement>>([])

const ACTIVE_ANNOUNCEMENTS = atom(
  (get) => {
    const dismissedAnnouncementIds = get(PERSISTED_DISMISSED_ANNOUNCEMENTS)
    const activeAnnouncements = get(ANNOUNCEMENTS_ATOM).filter(
      (announcement) => !dismissedAnnouncementIds.includes(announcement.id),
    )

    return activeAnnouncements
  },
  (get, set, newAnnouncement: Announcement) => {
    const allAnnouncements = get(ANNOUNCEMENTS_ATOM)
    const isExistingAnnouncement = allAnnouncements.some(
      (announcement) => announcement.id === newAnnouncement.id,
    )

    if (!isExistingAnnouncement) {
      set(ANNOUNCEMENTS_ATOM, [...get(ANNOUNCEMENTS_ATOM), newAnnouncement])
    }
  },
)

const useAnnouncements = () => {
  const [announcements, setAnnouncements] = useAtom(ACTIVE_ANNOUNCEMENTS)
  const setDismissedAnnouncementIds = useSetAtom(PERSISTED_DISMISSED_ANNOUNCEMENTS)

  const addAnnouncement = useCallback(
    (announcement: Announcement) => {
      setAnnouncements(announcement)
    },
    [setAnnouncements],
  )

  const dismissAnnouncement = useCallback(
    (announcementId: string) => {
      setDismissedAnnouncementIds((prev) => [...prev, announcementId])
    },
    [setDismissedAnnouncementIds],
  )

  return {
    announcements,
    addAnnouncement,
    dismissAnnouncement,
  }
}
