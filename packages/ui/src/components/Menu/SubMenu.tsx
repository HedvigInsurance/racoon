import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import { ReactNode, useCallback, useContext, useState } from 'react'
import AnimateHeight from 'react-animate-height'
import { ChevronIcon } from '../../icons/Chevron'
import { mq, useBreakpoint } from '../../lib/media-query'
import { Button } from '../Button/Button'
import { MenuThemeContext } from './Menu'
import { MenuItem } from './MenuItem'
import { MenuLink } from './MenuLink'

const TRANSITION_TIME = 150

const DropdownMenuContainer = styled.div<{
  isOpen: boolean
  hasMenuGroups?: boolean
}>(({ isOpen }) => ({
  opacity: isOpen ? 1 : 0,
  transition: `opacity ${TRANSITION_TIME}ms`,
  overflowY: 'hidden',
  color: colorsV3.gray900,

  [mq.md]: {
    display: isOpen ? 'block' : 'none',
    position: 'absolute',
    left: '50%',
    top: '100%',
    transform: 'translateX(-50%)',

    background: colorsV3.gray100,
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1), 0px 2px 5px rgba(0, 0, 0, 0.1);',
    borderRadius: '0.5rem',
  },
}))

const DropdownMenuItemList = styled.ul({
  margin: 0,
  padding: '1rem 0',
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',

  // Prefer to use styling in MenuItem, but use this for nested MenuItems
  li: {
    fontSize: '1.2rem',
    // indent sub-lists
    padding: '1rem 1.5rem',
  },
  [mq.md]: {
    li: {
      fontSize: 'initial',
    },
  },
})

// This component makes sure that we close the menu when it loses
// focus. It's hopefully useful when navigating with keyboard.
//
// thanks https://muffinman.io/blog/catching-the-blur-event-on-an-element-and-its-children/
type ChildrenBlurProps = {
  children: ReactNode
  onBlur: () => void
}
const ChildrenBlur = ({ children, onBlur, ...props }: ChildrenBlurProps) => {
  const handleBlur = useCallback(
    (e) => {
      const currentTarget = e.currentTarget

      // Give browser time to focus the next element
      requestAnimationFrame(() => {
        // Check if the new focused element is a child of the original container
        if (!currentTarget.contains(document.activeElement)) {
          onBlur()
        }
      })
    },
    [onBlur],
  )

  return (
    <div {...props} onBlur={handleBlur}>
      {children}
    </div>
  )
}

const SubMenuLabelWrapper = styled.span({
  display: 'flex',
  flexDirection: 'row',
  // aligns text with chevron icon
  alignItems: 'center',
})

type SubMenuProps = {
  title: ReactNode
  href?: string
  children: ReactNode
}

export const SubMenu = ({ title, href, children }: SubMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuItemTimeout, setMenuItemTimeout] = useState<NodeJS.Timeout>()
  const theme = useContext(MenuThemeContext)
  const isLargeScreen = useBreakpoint('md')

  // Delay the closing of the sub-menu so that the user can move the cursor
  // over to that element
  const handleMouseOutForMenuItem = () => {
    const timeout = setTimeout(() => {
      setIsOpen(false)
    }, 250)
    setMenuItemTimeout(timeout)
  }

  // immediately close the submenu when leaving submenu
  const handleMouseOutForSubMenu = () => {
    setIsOpen(false)
  }

  const handleMouseOver = () => {
    setIsOpen(true)
    clearTimeout(menuItemTimeout as NodeJS.Timeout)
  }

  return (
    <MenuItem>
      <SubMenuLabelWrapper onMouseOver={handleMouseOver} onMouseLeave={handleMouseOutForMenuItem}>
        <MenuLink href={href}>{title}</MenuLink>

        <Button
          onClick={() => setIsOpen(true)}
          size="sm"
          px="0.5rem"
          variant="text"
          color={theme}
          icon={
            <ChevronIcon
              size={isLargeScreen ? '0.75rem' : '1.125rem'}
              transform={isOpen ? 'rotate(-180)' : 'rotate(0)'}
            />
          }
        />
      </SubMenuLabelWrapper>

      <AnimateHeight duration={TRANSITION_TIME} height={isOpen ? 'auto' : 0}>
        <DropdownMenuContainer
          isOpen={isOpen}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOutForSubMenu}
        >
          <ChildrenBlur
            onBlur={() => {
              setIsOpen(false)
            }}
          >
            <MenuThemeContext.Provider value={isLargeScreen ? 'dark' : theme}>
              <DropdownMenuItemList>{children}</DropdownMenuItemList>
            </MenuThemeContext.Provider>
          </ChildrenBlur>
        </DropdownMenuContainer>
      </AnimateHeight>
    </MenuItem>
  )
}
