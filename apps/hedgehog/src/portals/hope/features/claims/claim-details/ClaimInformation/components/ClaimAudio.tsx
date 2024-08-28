import { useState } from 'react'
import * as React from 'react'
import styled from '@emotion/styled'
import { CloudArrowDownFill } from 'react-bootstrap-icons'
import { useClaim } from '@hope/features/claims/hooks/use-claim'
import gql from 'graphql-tag'
import { useTrackClaimAudioEventMutation } from 'types/generated/graphql'

gql`
  mutation TrackClaimAudioEvent(
    $eventName: String!
    $input: TrackClaimAudioEventInput!
  ) {
    trackClaimAudioEvent(eventName: $eventName, input: $input)
  }
`
const Audio = styled('audio')`
  width: 100%;
`

const ClaimAudioWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-right: 1em;
  justify-content: space-between;
  align-items: center;
`

const DownloadWrapper = styled.a`
  font-size: 1.5em;
  margin: 0.5em 0 0.5em 0.5em;
  padding-top: 0.4em;
`

const DownloadButton = styled(CloudArrowDownFill)`
  color: ${({ theme }) => theme.foreground};
`
const stripQueryFromUrl = (url: string) => {
  return url.split('?')[0] // Split the string at the question mark and return the first part
}

export const ClaimAudio: React.FC<{ recordingUrl: string }> = ({
  recordingUrl,
}) => {
  const [canPlay, setCanPlay] = useState<null | boolean>(null)
  const { claimId, memberId } = useClaim()
  const [trackClaimAudioEvent] = useTrackClaimAudioEventMutation()
  const trackAudioEvent = (eventName: string) => {
    const eventDetails = {
      audioUrl: stripQueryFromUrl(recordingUrl),
      timestamp: new Date().toISOString(),
      memberId: memberId,
      claimId: claimId,
    }
    trackClaimAudioEvent({
      variables: {
        eventName: eventName,
        input: eventDetails,
      },
    })
  }

  const handlePlay = () => {
    trackAudioEvent('play')
  }

  const handleEnded = () => {
    trackAudioEvent('ended')
  }

  if (canPlay === false) {
    return null
  }

  return (
    <ClaimAudioWrapper key={recordingUrl}>
      <Audio
        controls
        controlsList="nodownload"
        onCanPlay={() => setCanPlay(true)}
        onError={() => setCanPlay(false)}
        onPlay={handlePlay}
        onEnded={handleEnded}
      >
        <source src={recordingUrl} type="audio/aac" />
      </Audio>
      <DownloadWrapper
        href={recordingUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
      >
        <DownloadButton />
      </DownloadWrapper>
    </ClaimAudioWrapper>
  )
}
