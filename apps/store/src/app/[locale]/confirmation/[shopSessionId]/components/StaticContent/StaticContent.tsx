import { Heading, Text, yStack } from 'ui'
import { ConfirmationPageBlock } from '@/blocks/ConfirmationPageBlock'
import { type ConfirmationStory } from '@/services/storyblok/storyblok'
import { getImgSrc } from '@/services/storyblok/Storyblok.helpers'
import { container } from '../../ConfirmationPage.css'
import { AppDownload } from '../AppDownload/AppDownload'
import { CheckListItem } from '../CheckItem/CheckItem'
import { ImageSection } from '../ImageSection'

type Props = {
  content: ConfirmationStory['content']
}

export const StaticContent = (props: Props) => {
  const checklistItems = props.content.checklist.split('\n')

  return (
    <div
      className={yStack({
        gap: {
          _: 'xxl',
          sm: 'xxxl',
        },
      })}
    >
      <div className={container}>
        <section className={yStack({ gap: { _: 'md', sm: 'lg' } })}>
          <header>
            <Heading as="h2" variant="standard.24">
              {props.content.checklistTitle}
            </Heading>
            <Text as="p" color="textSecondary" size="xl">
              {props.content.checklistSubtitle}
            </Text>
          </header>

          <ul className={yStack({ gap: 'xs' })}>
            {checklistItems.map((item, index) => {
              const isLast = index === checklistItems.length - 1
              return (
                <CheckListItem key={item} checked={!isLast}>
                  {item}
                </CheckListItem>
              )
            })}
          </ul>
        </section>

        <section>
          <AppDownload />
        </section>
      </div>

      <div>
        <ImageSection
          image={{
            src: getImgSrc(props.content.footerImage.filename),
            alt: props.content.footerImage.alt,
          }}
        />

        <ConfirmationPageBlock blok={props.content} />
      </div>
    </div>
  )
}
