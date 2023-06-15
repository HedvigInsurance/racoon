import type { Meta, StoryObj } from '@storybook/react'
import { GridLayout } from '../GridLayout/GridLayout'
import { RichText } from './RichText'

const meta: Meta<typeof RichText> = {
  component: RichText,
}

export default meta
type Story = StoryObj<typeof RichText>

const Template: Story = {
  render: (args) => (
    <GridLayout.Root>
      <GridLayout.Content width={{ base: '1', md: '2/3', xl: '1/2' }} align={'center'}>
        <RichText {...args} />
      </GridLayout.Content>
    </GridLayout.Root>
  ),
}

const contentHTML =
  '<span class="preamble">Är hemförsäkring något som alla behöver? Vad kan hända om man inte har hemförsäkring? Här får du lära dig mer om vilket syfte försäkringen fyller och varför den är viktig att ha.</span></p><h2>Vad är hemförsäkring?</h2><p>En <a href="/se/forsakringar/hemforsakring/" target="_self" title="Hemförsäkring">hemförsäkring</a> innehåller ett viktigt grundskydd som omfattar dig, din familj, ditt hem och dina prylar. Namnet på försäkringen är dock en aning missvisande då den inte bara gäller när du befinner dig i ditt hem – du får även rättsskydd, överfallsskydd, <a href="/se/forsakringar/hemforsakring/reseskydd" target="_self">reseskydd</a> och ansvarsskydd. I Hedvigs hemförsäkringar ingår dessutom drulleförsäkring, vilket innebär att du får ersättning för plötslig och oförutsedd skada på dina prylar, till exempel om du råkar tappa din telefon i marken eller sätter dig på dina glasögon.</p><h2>Varför behöver man hemförsäkring?</h2><p>Med en hemförsäkring är du skyddad när det oväntade händer. Det är omöjligt att förutse att du kommer att bli sjuk under semestern, vara med om en brand eller att någon kommer att bryta sig in i din bostad. Även om du inte kan få tillbaka tiden du varit sjuk eller ägodelarna som stulits eller förstörts kan du få ersättning och slippa stå för de kostnader som händelsen medfört.</p><p><img alt="" src="https://a.storyblok.com/f/165473/2560x1440/5e32f3a7fc/awh_phone6.jpg" title="" /></p><h3>Vem behöver hemförsäkring?</h3><p>En hemförsäkring är den viktigaste försäkringen du kan ha, just eftersom den är så omfattande. Kort sagt behöver du en hemförsäkring om:</p><ol><li><p>Du har ett hem</p></li><li><p>Du är <a href="https://www.hedvig.com/se/forsakringar/hemforsakring/inneboende" target="_self" linktype="url" title="Hemförsäkring inneboende">inneboende</a>, bor i andra hand eller i <a href="https://www.hedvig.com/se/forsakringar/hemforsakring/student/studentboende" target="_self" linktype="url" title="Studentboende">studentboende</a>.</p></li><li><p>Du kan råka ut för en olycka eller utsättas för brott</p></li><li><p>Du äger föremål av olika slag</p></li><li><p>Du brukar resa till andra länder</p></li></ol><h2>Vad kan hända om man inte har hemförsäkring?</h2><p>Att inte ha hemförsäkring kan vara förödande för din privatekonomi om något tråkigt skulle inträffa. Det är inte alla som har möjlighet att lägga undan pengar för det oväntade, och även om du har en buffert är det inte säkert att den räcker till en advokat eller att åtgärda omfattande skador.</p><p>Idag är det dessvärre många unga som saknar hemförsäkring, trots att det är just de som inte har en stadig ekonomi som behöver skyddet allra mest. Att chansa på att allt ska gå bra och skippa att teckna en hemförsäkring kostar i slutändan ofta betydligt mer än att göra det.</p><h2>Vad är skillnaden mellan Hedvigs hemförsäkringar?</h2><p>När du ska teckna hemförsäkring är det viktigt att den är anpassad efter din boendesituation, det vill säga om du bor i andra hand, <a href="/se/forsakringar/hemforsakring/hyresratt" target="_self">hyresrätt</a> eller äger <a href="/se/forsakringar/hemforsakring/bostadsratt" target="_self">bostadsrätt</a> eller behöver en <a href="/se/forsakringar/hemforsakring/villaforsakring" target="_self">villaförsäkring</a>. Det beror på att försäkringarna är utformade efter boendesituationen för att du inte ska behöva betala mer än nödvändigt. Som hyresgäst är det till exempel inte ditt ansvar att renovera, och därför är det onödigt om det ingår skydd för skada vid ombyggnation.</p>'

export const Default: Story = {
  ...Template,
  args: {
    contentHTML,
  },
}

export const Large: Story = {
  ...Template,
  args: {
    contentHTML,
    largeText: true,
  },
}
