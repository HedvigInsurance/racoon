import styled from '@emotion/styled'
import { SerializedStyles, css } from '@emotion/react'
import { colors } from './palette'
import { fonts } from '@hedviginsurance/brand'

const setSizeVariables = (
  size: InputOrDropdownWrapperProps['size'] = 'medium',
): SerializedStyles => {
  let variables

  switch (size) {
    case 'small':
    case 'medium':
    case 'large':
      variables = css`
        --height: 56px;
        --padding-block: 10px;
        --padding-inline: 16px;
        --border-width: 0.5px;
        --border-radius: 10px;
        --font-size: 16px;
        --font-size-lifted-label: 12px;
      `
      break
  }

  return variables
}

const HIDE_NUMBER_ARROWS = css`
  /* Chrome, Safari, Edge, Opera */
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
`

export type InputOrDropdownWrapperProps = {
  size?: 'small' | 'medium' | 'large'
  active?: boolean
  disabled?: boolean
}

export const InputOrDropdownWrapper = styled.div<InputOrDropdownWrapperProps>(
  ({ size, disabled }) => css`
    ${setSizeVariables(size)};
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;

    font-size: var(--font-size);
    line-height: 1;

    background-color: ${colors.opaque1};
    color: ${colors.textSecondary};

    border-radius: var(--border-radius);
    border: 0.5px solid ${colors.borderTranslucent2};

    &:focus-within {
      border-color: ${colors.textSecondary};
    }

    // Applies to usage with inputs
    &:not(:has(.trigger)) {
      padding: var(--padding-block) var(--padding-inline);
      min-height: var(--height);
    }

    ${disabled &&
    css`
      pointer-events: none;
      background-color: ${colors.opaque2};
      * {
        color: ${colors.textSecondary};
        cursor: default;
      }
    `}

    .value {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;

      .value__display {
        color: ${colors.textPrimary};
        width: 100%;
        line-height: 18.4px;
        letter-spacing: normal;
        font-family: ${fonts.HEDVIG_LETTERS_STANDARD};
      }

      .value__clear-icon {
        ${disabled &&
        css`
          opacity: 0;
        `};
      }
    }

    .cta {
      cursor: pointer;

      ${disabled &&
      css`
        pointer-events: none;
      `}
    }

    .label {
      position: absolute;
      top: var(--padding-block);
      font-size: var(--font-size-lifted-label);
    }

    .trigger {
      display: flex;
      justify-content: space-between;
      width: 100%;
      background: none;
      border: none;
      outline: none;
      font-size: inherit;
      text-align: start;
      color: inherit;
      padding: var(--padding-block) var(--padding-inline);
      min-height: var(--height);
    }

    input {
      ${HIDE_NUMBER_ARROWS};
      color: ${colors.textPrimary};
      border: none;
      outline: none;
      background: none;
      width: 100%;
      font-size: inherit;
    }

    &:has(.label) {
      input::placeholder {
        opacity: 0;
      }
    }

    ${disabled &&
    css`
      cursor: default;
      background-color: ${colors.opaque2};
      * {
        color: ${colors.textSecondary};
        cursor: default;
      }
    `};

    &:has(input:placeholder-shown) {
      .value__clear-icon {
        opacity: 0;
        pointer-events: none;
      }
    }
  `,
)
