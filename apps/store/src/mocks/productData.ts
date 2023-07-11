import { ProductData } from '@/components/ProductPage/ProductPage.types'
import { InsurableLimitType, InsuranceDocumentType } from '@/services/apollo/generated'

export const productData: ProductData = {
  __typename: 'Product',
  id: 'Product:SE_APARTMENT_BRF',
  name: 'SE_APARTMENT_BRF',
  displayNameFull: 'Homeowner Insurance',
  displayNameShort: 'Homeowner',
  tagline: 'For you, your stuff and your apartment',
  pillowImage: {
    __typename: 'StoryblokImageAsset',
    id: '9003664',
    alt: '',
    src: 'https://a.storyblok.com/f/165473/832x832/f98d88ac63/hedvig-pillows-homeowner.png',
  },
  variants: [
    {
      __typename: 'ProductVariant',
      typeOfContract: 'SE_APARTMENT_BRF',
      displayName: 'Home Insurance Homeowner',
      perils: [
        {
          __typename: 'Peril',
          title: 'Fire',
          description:
            'We will cover fire damage, e.g. an over-heated mobile charger or a failed attempt to fry fries. In case of an apartment fire, we can reimburse you for fire and smoke damages.',
          covered: [
            'Fire due to open flames (not just glow)',
            'Explosion',
            'Sudden damage caused by soot',
            'Lightning',
            'Corrosive gas created by unintentional burning of plastics',
            'Cleaning of soot caused by open fire',
          ],
          exceptions: ['Explosive work', 'Soot from lit candles'],
          colorCode: '#C45D4F',
        },
        {
          __typename: 'Peril',
          title: 'Water leaks',
          description:
            'We cover different types of water damages, for example if a washing machine leaks uncontrollably or if a bathroom is flooded. We can reimburse you for damages to the apartment and for other costs incurred during the reparations.',
          covered: [
            'Unexpected escape of liquid/steam from the pipework system, connected appliances or kitchen, laundry room and bathroom.',
            'Leaking fridge/freezer',
            'Leaking fire extinguisher',
            'Leaking sink',
            'Leaking aquarium',
          ],
          exceptions: [
            'Surface and water barrier installed by uncertified plumber',
            'Damage to the leaking unit itself',
            'Damage caused by roof gutters or external downspouts',
          ],
          colorCode: '#98C2DA',
        },
        {
          __typename: 'Peril',
          title: 'Burglary',
          description:
            'If someone, without permission, enters or damages your apartment, this will be covered by your insurance.',
          covered: ['Everything you own in your apartment up to a total value of SEK 1 million'],
          exceptions: [
            'Theft of money, valuable documents and other theft-prone property (jewelry, mobile phones, computers and other expensive items) from ancillary areas',
          ],
          colorCode: '#B4B4B4',
        },
        {
          __typename: 'Peril',
          title: 'Theft and damage',
          description:
            'If thieves steal or damage your precious items, your home insurance will help you. Whether you are at home or out travelling, you can count on us.',
          covered: [
            'Theft or damage to your home',
            'Theft from common spaces, e.g. bike or stroller storage',
            'Theft or damage to possessions that you have taken to work or a hotel room',
            'Storage, e.g. Shurgard',
            'Theft outside the home',
            'Theft from car while travelling',
          ],
          exceptions: [
            'For some items, e.g. money, electronics, mobile phones, computers, cameras, liquor and jewelry, special rules apply depending on where the theft occurred.',
          ],
          colorCode: '#B4B4B4',
        },
        {
          __typename: 'Peril',
          title: 'Criminal damage',
          description:
            'Your home insurance covers you if any person, without permission, enters or damages your apartment.',
          covered: ['Everything you own in your apartment up to a total value of SEK 1 million'],
          exceptions: [
            'Theft of money, valuable documents and theft-prone property (jewelry, mobile phones, computers and other expensive property) from ancillary spaces',
          ],
          colorCode: '#727272',
        },
        {
          __typename: 'Peril',
          title: 'Liability protection',
          description:
            'When someone claims that you injured them or that you damaged their property, we can help you to investigate what happened. If you caused the damage, we can reimburse you for court costs and pay damages.',
          covered: [
            "E.g. damages to someone else's sink",
            'E.g. leak from your apartment that affects your neighbour',
            'E.g. your dog bites someone',
            'Investigation and negotiation',
            'Legal representation',
            'Compensation: Maximum SEK 5 Million',
          ],
          exceptions: [
            'Injury related to your work',
            'Damages from driving',
            'Intentional crime, e.g. if you injure someone on purpose',
          ],
          colorCode: '#D5CE82',
        },
        {
          __typename: 'Peril',
          title: 'Legal protection',
          description:
            'We can reimburse you for the cost of hiring an attorney if you end up in legal dispute. The coverage is valid for disputes tried in the district court, the High Court or the Supreme Court.',
          covered: [
            'Custody dispute',
            'Inheritance dispute',
            'Property dispute',
            'Legal representation',
            'Claims according to Tort Liability Act',
            'Compensation: SEK 1,500 - 250,000, 25% deductible',
          ],
          exceptions: [
            'Simplified litigation according to Code of Judicial Procedure',
            "Intentional crimes, e.g. if you've injured someone on purpose",
          ],
          colorCode: '#D5CE82',
        },
        {
          __typename: 'Peril',
          title: 'Travel insurance',
          description:
            'In the event of war or a natural catastrophe during your outbound travel, we will reimburse you for the cost of a flight home and other necessary and reasonable costs.',
          covered: [
            'Travel coverage first 45 days',
            'Evacuation in the event of war',
            'Evacuation in the event of an epidemic',
            'Evacuation in the event of natural catastrophes, earthquake or volcanic eruption',
          ],
          exceptions: [
            'Travelling home from places the Swedish Ministry of Foreign Affairs warns you to not travel to',
            'Lost luggage',
          ],
          colorCode: '#FFBF00',
        },
        {
          __typename: 'Peril',
          title: 'Assault',
          description:
            "We will compensate you if you're the victim of a crime, e.g. assault, robbery or rape. You can also seek compensation if someone attempts to commit crimes against you.",
          covered: [
            'Assault or robbery',
            'Aggravated assault with life threatening damages',
            'Aggravated robbery',
            'Persecution aged 18 and under',
            'Rape',
            'Compensation: SEK 8,000 - 200,000, no deductible',
          ],
          exceptions: [
            'Crimes in connection to work or if you intervened in a fight',
            'Damages in connection to rioting / hooliganism / domestic violence',
          ],
          colorCode: '#AC7339',
        },
        {
          __typename: 'Peril',
          title: 'Travel illness',
          description:
            'Our travel protection is eligible during the first 45 days of your travel and will reimburse you for costs due to acute illness, injury and acute dental injury. If considered necessary, we can provide you with a flight back home to Sweden for further medical assistance.',
          covered: [
            'Casualty, acute illness, acute dental issues',
            'Cancelled travel due to a closely related person dying / becoming seriously ill or injured',
            'Medical assistance and accommodation',
            'No deductible',
            'No maximum limit for reimbursement',
          ],
          exceptions: [
            'Illness or medical condition known before departure',
            'Martial arts with body contact / sky diving / paragliding',
          ],
          colorCode: '#A4C9C6',
        },
        {
          __typename: 'Peril',
          title: 'White goods',
          description:
            'We are here for you when you you have issues with your fridge, freezer, washing machine, dryer, dishwasher or oven. If your freezer breaks down, we will even compensate you for spoiled food.',
          covered: [
            'White goods/home appliances due to short circuit, over voltage or high voltage',
            'Installations of heating, water supply, sewerage, ventilation and gas',
            'Windows panes',
            'Clothes due to washing machine/dryer problems',
            'Sanitary ware (e.g. toilet and sink)',
            'Food in freezer due to power outage',
            'Self-installed elevator (Maximum SEK 20,000)',
          ],
          exceptions: [
            'Superficial damages and beauty defects',
            'Underfloor heating in bathrooms or other wet spaces',
          ],
          colorCode: '#E0E0E0',
        },
        {
          __typename: 'Peril',
          title: 'All-risk',
          description:
            'Our all-risk insurance can provide compensation for damages caused by a sudden and unforeseen external event, e.g. spilling coffee on your laptop, dropping your mobile phone or sitting on your glasses. All-risk is always included at no extra costs.',
          covered: [
            'Unforeseen damages',
            'Unforeseen events',
            'E.g. you spilled coffee on your laptop',
            'E.g. you dropped your phone in the toilet',
            'E.g. you sat on your glasses',
            'Compensation: SEK 50,000, max, per claim',
          ],
          exceptions: [
            'Borrowed property, e.g. work computer',
            'Theft-prone property from car/ancillary area, e.g camera, jewelry',
            'Theft of cash or valuable documents',
          ],
          colorCode: '#A49758',
        },
        {
          __typename: 'Peril',
          title: 'Tenant ownership',
          description:
            'When owning an apartment it\'s nice to have an insurance which covers the apartment, not just the gadgets inside of it. In the insurance world, this is called \\"Bostadsrättstillägg\\". Hedvig can compensate you for costs to repair damage to your apartment. Whether you live in a room or a penthouse, there\'s no compensation cap.',
          covered: [
            'Water or fire damage on interior, e.g. your new kitchen',
            'Water or fire damage on surfaces, e.g. your new floor',
          ],
          exceptions: ["There's nothing special for you to think about"],
          colorCode: '#24CC5C',
        },
      ],
      insurableLimits: [
        {
          __typename: 'InsurableLimit',
          type: InsurableLimitType.InsuredAmount,
          label: 'Your apartment is insured at',
          limit: 'Full value',
          description:
            'If your apartment is damaged, Hedvig will pay for the reparation or restoration without any threshold',
        },
        {
          __typename: 'InsurableLimit',
          type: InsurableLimitType.InsuredAmount,
          label: 'Your things are insured at',
          limit: '1 000 000 SEK',
          description: 'All your possessions are together insured up to 1 million SEK',
        },
        {
          __typename: 'InsurableLimit',
          type: InsurableLimitType.Deductible,
          label: 'The deductible is',
          limit: '1 500 SEK',
          description: 'Deductible is the amount you have to pay yourself in the event of a damage',
        },
        {
          __typename: 'InsurableLimit',
          type: InsurableLimitType.TravelDays,
          label: 'Travel insurance',
          limit: '45 days',
          description:
            'Travel insurance covers you during the first 45 days of your trip and is valid worldwide',
        },
      ],
      documents: [
        {
          __typename: 'InsuranceDocument',
          type: InsuranceDocumentType.TermsAndConditions,
          displayName: 'SE Apartment Terms and Conditions',
          url: 'https://promise-cms.s3.eu-central-1.amazonaws.com/SE_APARTMENT_BRF_T_and_C_2022_11_01_HEDVIG_4b078e6dc8.pdf',
        },
        {
          __typename: 'InsuranceDocument',
          type: InsuranceDocumentType.PreSaleInfo,
          displayName: 'SE Apartment BRF IPID',
          url: 'https://promise-cms.s3.eu-central-1.amazonaws.com/SE_APARTMENT_BRF_IPID_2022_11_01_20c6e37d9f.pdf',
        },
        {
          __typename: 'InsuranceDocument',
          type: InsuranceDocumentType.PreSaleInfo,
          displayName: 'SE Apartment BRF Presale',
          url: 'https://promise-cms.s3.eu-central-1.amazonaws.com/SE_APARTMENT_BRF_PRESALE_2022_11_01_990f775ff6.pdf',
        },
      ],
    },
  ],
}
