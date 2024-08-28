'use client'

import styled from '@emotion/styled'
import { Flex, Popover } from '@hedvig-ui'
import { useEffect, useState } from 'react'
import * as React from 'react'
import { Link45deg } from 'react-bootstrap-icons'
import copy from 'copy-to-clipboard'

const CopyableWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 0.5rem;

  .link-icon {
    color: black;
    background-color: ${({ theme }) => theme.backgroundTransparent};
    border-radius: 6px;
    font-size: 1.1em;
    opacity: 1;
  }

  .link-text {
    color: ${({ theme }) => theme.accent};
  }

  .default-text {
    color: black;
  }

  .component {
    cursor: pointer;
    margin-right: 0.25em;
  }

  .link-icon:hover {
    cursor: pointer;
  }
`

export const Copyable: React.FC<{
  textLabel?: string
  copyValue?: string
  textValue?: string | null
  iconLabel?: string
  iconValue?: string | null
}> = ({ textLabel, textValue, iconLabel, iconValue, copyValue }) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setTimeout(() => setCopied(false), 1000)
  }, [copied])

  const handleCopy = (value?: string | null) => {
    if (!value) return
    copy(value, {
      format: 'text/plain',
    })
    setCopied(true)
  }

  return (
    <CopyableWrapper onMouseLeave={() => setCopied(false)}>
      <Popover
        contents={
          copied
            ? 'Copied'
            : `Click to copy${textLabel ? ' ' + textLabel.toLowerCase() : ''}`
        }
      >
        <div
          className={`component ${iconValue ? 'default-text' : 'link-text'}`}
          onClick={() => handleCopy(copyValue ?? textValue ?? iconValue)}
        >
          {textValue ?? iconValue}
        </div>
      </Popover>
      {iconValue && (
        <Popover
          contents={
            copied
              ? 'Copied'
              : `Click to copy${iconLabel ? ` ${iconLabel.toLowerCase()}` : ''}`
          }
        >
          <Flex direction="column" justify="flex-end">
            <Link45deg
              onClick={() => handleCopy(iconValue)}
              className="link-icon"
            />
          </Flex>
        </Popover>
      )}
    </CopyableWrapper>
  )
}
