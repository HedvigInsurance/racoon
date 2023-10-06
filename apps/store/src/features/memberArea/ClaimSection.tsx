import styled from '@emotion/styled'
import { Heading, Space, Text, mq, theme } from 'ui'
import { ButtonNextLink } from '@/components/ButtonNextLink'
import { ImageWithPlaceholder } from '@/components/ImageWithPlaceholder/ImageWithPlaceholder'
import { richTextStyles } from '@/components/RichText/RichText.styles'
import { getImgSrc } from '@/services/storyblok/Storyblok.helpers'

export const ClaimSection = () => {
  return (
    <>
      <Wrapper>
        <div>
          <Heading as="h2" variant="standard.24">
            Get help fast in the Hedvig app
          </Heading>
          <Space y={2}>
            <Text color="textSecondary" size="xl">
              As a member, you can ask questions, report claims or change your details directly in
              the Hedvig app.
            </Text>
            <ButtonNextLink
              size="medium"
              href="https://hedvig.page.link/home_app_fallback_en"
              target="_self"
            >
              Open the app
            </ButtonNextLink>
            <ImageWrapper>
              <Image
                src={getImgSrc(
                  'https://a.storyblok.com/f/165473/2560x1440/cdcfb94176/awh_voicememo.jpg',
                )}
                fill
                alt="Claim"
              />
            </ImageWrapper>
          </Space>
        </div>

        <div>
          <Info />
        </div>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div({
  display: 'grid',
  gridGap: theme.space.lg,
  width: '100%',
  [mq.lg]: {
    gridTemplateColumns: '1fr 1fr',
  },
})

const ImageWrapper = styled.div({
  position: 'relative',
  maxWidth: '600px',
  aspectRatio: '6 / 4',
})

const Image = styled(ImageWithPlaceholder)({
  borderRadius: theme.radius.md,
  objectFit: 'cover',
})

const Info = () => (
  <RichStyling>
    <ul>
      <li>
        <p>
          Get help in the Hedvig app:
          <br />
          Report a claim, chat with us, ask questions and get help in the{' '}
          <a href="https://hedvig.page.link/home_app_fallback_en" target="_self" rel="nofollow">
            Hedvig app
          </a>
          .<br />
          <br />
        </p>
      </li>
      <li>
        <p>
          No phone available?
          <br />
          If you {"don't"} have access to your phone, you can report a{' '}
          <a href="/se-en/help/email-us" target="_self">
            claim via email
          </a>
          .<br />
          <br />
        </p>
      </li>
      <li>
        <p>
          Acutely ill abroad:
          <br />
          Contact Hedvig Global Assistance (SOS International). They will help you get the right
          medical care. Call +45 38 48 94 61, around the clock.
          <br />
          <br />
        </p>
      </li>
      <li>
        <p>
          Roadside assistance and car towing:
          <br />
          Contact our partner Assistancekåren. Call +46 10 45 99 222, around the clock.
          <br />
          <br />
        </p>
      </li>
      <li>
        <p>
          Veterinary care:
          <br />
          For advice and referral to a veterinary clinic, book a{' '}
          <a href="/se-en/insurances/pet-insurance/claims" target="_self">
            video call
          </a>{' '}
          with FirstVet.
          <br />
          <br />
        </p>
      </li>
      <li>
        <p>
          Cleaning of pests in houses:
          <br />
          Contact our partner Nomor on 0771-122 300 or at{' '}
          <a href="http://nomor.se" target="_blank" rel="nofollow">
            nomor.se
          </a>
          .
        </p>
      </li>
    </ul>
  </RichStyling>
)

const RichStyling = styled.div(richTextStyles, {
  paddingBlock: theme.space.md,
  paddingInline: theme.space.md,
  backgroundColor: theme.colors.opaque1,
  borderRadius: theme.radius.md,
})
