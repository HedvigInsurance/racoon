import { type Meta, type StoryFn } from '@storybook/react'
import { yStack } from '../../patterns'
import { Button } from '../Button/Button'
import { Text } from '../Text/Text'
import * as Dialog from './Dialog'
import { LargeDialog } from './LargeDialog'

export default {
  title: 'Dialog',
  parameters: {
    backgrounds: {
      default: 'gray100',
    },
    layout: 'centered',
  },
} as Meta<unknown>

export const Large: StoryFn = () => {
  return (
    <div>
      <Dialog.Root>
        <div className={yStack({ gap: 'md' })}>
          Button opens dialog. Inner content is scrollable when it does not fit
          <Dialog.Trigger asChild>
            <Button variant="secondary">Click me</Button>
          </Dialog.Trigger>
        </div>

        <LargeDialog.Content>
          <LargeDialog.Header>Hello, world!</LargeDialog.Header>
          <LargeDialog.ScrollableInnerContent className={yStack({ gap: 'md' })}>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec libero lacinia,
              commodo odio eget, sodales leo. Integer vitae lectus nec lectus facilisis condimentum
              vitae eu felis. Etiam eget orci consectetur, blandit sem sit amet, porta quam.
              Pellentesque feugiat, ligula ac rutrum iaculis, purus nunc posuere quam, non luctus
              lectus justo quis justo. Ut condimentum massa a fermentum gravida. In id tellus et
              tellus sollicitudin iaculis. Maecenas ornare ex non elit porta interdum. Integer
              sodales aliquam tellus ac lacinia. Praesent ornare lorem et ex malesuada pellentesque
              in commodo sem. Etiam at libero ut purus molestie sagittis.
            </Text>
            <Text>
              Pellentesque finibus vitae nisi et aliquam. Sed eros tellus, blandit eget dolor eget,
              vestibulum aliquam libero. Etiam massa lorem, varius quis arcu in, blandit condimentum
              leo. Proin consequat sodales lectus eu bibendum. Phasellus tempor pharetra dictum.
              Aenean suscipit elit eu dapibus porttitor. Donec euismod sollicitudin fringilla. Proin
              ac enim lobortis, mollis neque quis, posuere mauris. Donec sed tellus aliquam, dapibus
              erat quis, imperdiet quam. In at sem quis dui finibus dapibus. Nam nisi enim, pulvinar
              a nisi convallis, molestie tincidunt nulla. Vivamus accumsan posuere scelerisque.
            </Text>
            <Text>
              Duis ac arcu quis lorem porta auctor. Mauris fermentum risus vitae volutpat convallis.
              Proin tortor odio, auctor eget neque ac, semper elementum ligula. Sed fermentum
              maximus orci et mattis. Quisque convallis quis nibh eget dignissim. Donec auctor erat
              erat, tristique maximus dui ullamcorper eget. Nullam ultrices urna nec ultrices
              tempor. Suspendisse potenti. Maecenas tincidunt tempus velit, in congue odio gravida
              non. Proin at nulla non nisi scelerisque accumsan eu sed augue. Nunc at rutrum leo.
              Curabitur eu egestas elit. Donec lobortis pretium risus, nec viverra nulla egestas
              eget. Praesent ultricies facilisis malesuada.
            </Text>
            <Text>
              In non dui molestie, blandit ex porta, condimentum metus. Integer elementum semper
              finibus. Nulla egestas luctus neque. Praesent luctus eros sit amet lorem pellentesque
              malesuada. Ut turpis quam, iaculis vel magna ac, consectetur porttitor eros. Praesent
              ultrices, massa ac rutrum molestie, velit est varius nisl, sed venenatis arcu purus
              eget dui. In dapibus mattis neque, et vehicula neque lobortis sed.
            </Text>
            <Text>
              Ut sit amet massa sollicitudin, dictum est rutrum, commodo nibh. Morbi aliquet ornare
              est, in tristique massa tristique quis. Donec quis sapien lorem. Sed vestibulum
              vestibulum tellus. Nunc varius odio lectus, ut malesuada quam rhoncus ac. Orci varius
              natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vel
              neque sit amet urna faucibus dapibus. In at risus finibus, aliquet leo sit amet,
              laoreet massa. Duis et elit eleifend, commodo magna id, pellentesque ligula. Phasellus
              et commodo ligula. Donec porta, dui vel semper lacinia, arcu neque egestas nisl, at
              sodales elit augue ut orci. Morbi vel nibh leo.
            </Text>
          </LargeDialog.ScrollableInnerContent>
        </LargeDialog.Content>
      </Dialog.Root>
    </div>
  )
}
