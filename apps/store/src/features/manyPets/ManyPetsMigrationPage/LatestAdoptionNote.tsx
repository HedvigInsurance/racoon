import { InfoCard } from '@/components/InfoCard/InfoCard'

export const LatestAdoptionNote = ({ date }: { date: string }) => {
  const formattedDate = new Date(date).toLocaleString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <InfoCard>
      {`Teckna innan ${formattedDate} så börjar försäkringen gälla när din nuvarande förfaller.`}
    </InfoCard>
  )
}
