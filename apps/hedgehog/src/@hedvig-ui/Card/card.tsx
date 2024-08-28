'use client'

import styled from '@emotion/styled'
import { InfoTag, InfoTagStatus, ThirdLevelHeadline } from '@hedvig-ui'
import { colorsV3 } from '@hedviginsurance/brand'
import Link from 'next/link'
import { useRef } from 'react'
import * as React from 'react'
import { LockFill } from 'react-bootstrap-icons'

export const CardsWrapper = styled.div<{ contentWrap?: string }>`
  display: flex;
  flex-direction: row;
  flex-wrap: ${({ contentWrap = 'wrap' }) => contentWrap};
  margin: 0rem;
`

const LockedOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(255 255 255 / 70%);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5rem;
`

type PaddingSize = 'none' | 'small' | 'medium' | 'large'

export const paddingMap: Record<PaddingSize, string> = {
  none: '0',
  small: '0.5rem',
  medium: '2rem',
  large: '3rem',
}
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: number
  padding?: PaddingSize
  locked?: boolean
  deleted?: boolean
  children: React.ReactNode
}

const CardContainer = styled.div<CardProps>`
  display: inline-flex;
  min-width: ${({ span }) => `calc(100%/${span ?? 1} - 1rem)`};
  margin: 0.5rem;
  padding: ${({ padding = 'medium' }) => paddingMap[padding]};
  align-items: flex-start;
  flex-direction: column;
  flex-grow: 1;
  color: ${({ theme }) => theme.foreground ?? colorsV3.gray900};
  background-color: ${({ theme }) => theme.accentLighter ?? colorsV3.white};
  border: 1px solid ${({ theme }) => theme.border ?? colorsV3.gray300};
  border-radius: 0.5rem;
  position: relative;
`

export const CardLink = CardContainer.withComponent(Link)

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, locked, deleted, ...cardProps }, forwardRef) => {
    const internalRef = useRef<HTMLInputElement>(null)

    const ref = forwardRef ?? internalRef

    return (
      <CardContainer ref={ref} {...cardProps}>
        {children}
        {locked && (
          <LockedOverlay>
            {deleted ? 'Deleted' : 'Locked'}
            <LockFill />
          </LockedOverlay>
        )}
      </CardContainer>
    )
  },
)

export const DangerCard = styled(Card)<CardProps>`
  background-color: ${({ theme }) => theme.danger ?? colorsV3.white};
  border: 1px solid ${({ theme }) => theme.border ?? colorsV3.gray300};
`

export const CardContent = styled('div')`
  width: 100%;
`

export interface CardTitleBadgeProps {
  icon?: React.ElementType
  status: InfoTagStatus
  label: string
}

const CardTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const CardTitle: React.FC<{
  title: string
  badge?: CardTitleBadgeProps | null
}> = ({ title, badge }) => {
  const BadgeIcon = badge?.icon

  return (
    <CardTitleWrapper>
      <div>
        <ThirdLevelHeadline>{title}</ThirdLevelHeadline>
      </div>
      {badge && (
        <InfoTag
          style={{
            fontWeight: 'bold',
            padding: '0.2em 0.7em',
            fontSize: '0.85em',
          }}
          status={badge.status}
        >
          {BadgeIcon && (
            <BadgeIcon
              style={{
                paddingTop: '0.2em',
                marginRight: '0.5em',
              }}
            />
          )}
          {badge.label}
        </InfoTag>
      )}
    </CardTitleWrapper>
  )
}
