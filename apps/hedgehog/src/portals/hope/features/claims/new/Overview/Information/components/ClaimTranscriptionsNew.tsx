import { useClaim } from '../../../../hooks/use-claim'
import { InfoTag, LabeledText } from '@hedvig-ui/redesign'

export const ClaimTranscriptionsNew = () => {
  const { claimTranscriptions: transcriptions } = useClaim()

  if (transcriptions.length === 0) {
    return null
  }

  const transcription = transcriptions[0]

  return (
    <>
      <LabeledText label="Transcription">
        <span style={{ lineHeight: '1.375em' }}>{transcription.text}</span>
      </LabeledText>
      <InfoTag variant="info" style={{ width: 'max-content' }}>
        Language code: {transcription.languageCode}
      </InfoTag>
    </>
  )
}
