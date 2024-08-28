import styled from '@emotion/styled'
import { CardContent, CardTitle, List, ListItem, Paragraph } from '@hedvig-ui'
import { useClaim } from '../hooks/use-claim'

const Transcription = styled(Paragraph)`
  font-size: 1rem;
  max-width: 80%;
  white-space: pre-wrap;
`

const ClaimTranscriptionMetaData = styled(Paragraph)`
  font-size: 0.875rem;
  text-align: right;
`

export const ClaimTranscriptions = () => {
  const { claimTranscriptions: transcriptions } = useClaim()

  return (
    <CardContent>
      <CardTitle title="Transcription" />

      <List>
        {transcriptions.map((transcription) => (
          <ListItem key={transcription.text}>
            <Transcription>{transcription.text}</Transcription>
            <List>
              <ClaimTranscriptionMetaData>
                <br /> Language code: {transcription.languageCode}
              </ClaimTranscriptionMetaData>
            </List>
          </ListItem>
        ))}
      </List>
    </CardContent>
  )
}
