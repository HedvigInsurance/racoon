export { Spacing, spacingMap } from './Spacing/spacing'
export { Badge } from './Badge/badge'
import { BadgeProps as _BadgeProps } from './Badge/badge'
import { ButtonProps as _ButtonProps } from './Button/button'
import { CardTitleBadgeProps as _CardTitleBadgeProps } from './Card/card'
import { DropdownProps as _DropdownProps } from './Dropdown/dropdown'
import { SelectProps as _SelectProps } from './Select'
import { InfoTagStatus as _InfoTagStatus } from './InfoRow/info-row'
import {
  ModalAdditionalOptions as _ModalAdditionalOptions,
  ModalProps as _ModalProps,
} from './Modal'
import { FlagProp as _FlagProp } from './OrbIndicator/orb-indicator'
import { SpacingSize as _SpacingSize } from './Spacing/spacing'
import { TabsProps as _TabsProps } from './Tabs'
import { TextAreaProps as _TextAreaProps } from './TextArea/text-area'
import { FadeInProps as _FadeInProps } from './animations/fade-in'
import {
  FadeDirection as _FadeDirection,
  FadeType as _FadeType,
} from './animations/fade'
import { UseVerticalKeyboardNavigationProps as _UseVerticalKeyboardNavigationProps } from './hooks/keyboard/use-keyboard-listener'
import { SelectOption as _SelectOption } from './SearchableDropdown/searchable-dropdown'
import { Key as _Key } from './hooks/keyboard/use-key-is-pressed'
import { HotkeyHintProps as _HotkeyHintProps } from './HotkeyHint'
import { NavigationProps as _NavigationProps } from './Navigation/Navigation'

import { TableRowProps as _TableRowProps } from './Table/table'

export { Flex } from './Flex/flex'

export type CardTitleBadgeProps = _CardTitleBadgeProps
export type BadgeProps = _BadgeProps

export {
  Button,
  ConfirmingButtonsWrapper as ConfirmingButton,
  ButtonsGroup,
} from './Button/button'

export { GlobalStyles } from './themes'

export {
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TablePageSelect,
  TableRow,
  TableBody,
} from './Table/table'

export type TableRowProps = _TableRowProps

export type ButtonProps = _ButtonProps

export {
  Card,
  CardContent,
  CardLink,
  CardsWrapper,
  DangerCard,
  CardTitle,
} from './Card/card'
export { CasualList, CasualListItem } from './CasualList/casual-list'
export { Checkbox } from './Checkbox/checkbox'
export { Copyable } from './Copyable/copyable'
export { DateTimePicker } from './DateTimePicker/DateTimePicker'

export { Dropdown, Option as DropdownOption } from './Dropdown/dropdown'
export type DropdownProps = _DropdownProps
export { SelectOrInput } from './Dropdown/SelectOrInput'

export {
  ExcelInput,
  type FileUploadTableStatusType,
} from './FileInput/ExcelInput'

export { Select } from './Select'
export type SelectProps = _SelectProps

export { MultiDropdown } from './Dropdown/multi-dropdown'
export {
  InfoContainer,
  InfoRow,
  InfoSection,
  InfoTag,
  InfoText,
} from './InfoRow/info-row'
export type InfoTagStatus = _InfoTagStatus
export { Input, type InputProps } from './Input/input'
export { CalculatingInput } from './Input/calculator'
export { JsonSchemaForm } from './JsonSchemaForm/json-schema-form'
export { List, ListItem } from './List/list'
export { Loadable } from './Loadable/loadable'

export { OrbIndicator } from './OrbIndicator/orb-indicator'
export type OrbFlagsType = _FlagProp

export { Popover } from './Popover/popover'
export { RadioGroup, Radio } from './Radio/radio'
export { SearchableDropdown } from './SearchableDropdown/searchable-dropdown'
export { Spinner } from './Spinner/spinner'
export { TextArea } from './TextArea/text-area'
export type TextAreaProps = _TextAreaProps
export { Row } from './Row/row'

export { FadeIn, withFadeIn } from './animations/fade-in'
export type FadeInProps = _FadeInProps

export { Fade, useFadeAnimation } from './animations/fade'
export type FadeDirection = _FadeDirection
export type FadeType = _FadeType

export {
  LoadingMessage,
  StandaloneMessage,
} from './animations/standalone-message'
export { fadeIn } from './animations/utils'

export type SpacingSize = _SpacingSize

export {
  convertEnumOrSentenceToTitle,
  convertEnumToTitle,
  convertEnumToSentence,
  convertCamelcaseToTitle,
  convertEmailToName,
  convertEmailToSignature,
  convertFullNameToShort,
  capitalize,
  addSToName,
  formatPostalCode,
  isStringNumber,
  formatSsn,
} from './utils/text'
export {
  stringSortByNumberOrText,
  partitionBy,
  groupBy,
} from '@hedvig-ui/utils/collection-utils'
export { darkTheme, lightTheme, BaseStyle, type ThemeType } from './themes'
export { DarkmodeProvider, useDarkmode } from './hooks/use-darkmode'

export {
  Bold,
  Capitalized,
  ErrorText,
  FourthLevelHeadline,
  Label,
  MainHeadline,
  Paragraph,
  Placeholder,
  SecondLevelHeadline,
  Shadowed,
  ThirdLevelHeadline,
  Monetary,
  Hotkey,
  HotkeyStyled,
} from './Typography/typography'

export { Modal } from './Modal'
export type ModalProps = _ModalProps
export type ModalAdditionalOptions = _ModalAdditionalOptions

export { Tab, Tabs } from './Tabs'

export type TabsProps = _TabsProps

export { TextDatePicker } from './TextDatePicker'

export { useDebounce } from './hooks/use-debounce'

export type UseVerticalKeyboardNavigationProps =
  _UseVerticalKeyboardNavigationProps

export type SelectOption = _SelectOption

export { CreatableDropdown } from './SearchableDropdown/searchable-dropdown'

export { useDraft, DraftProvider } from './hooks/use-draft'
export { usePlatform } from './hooks/use-platform'
export { useInsecurePersistentState } from './hooks/use-insecure-persistent-state'
export { range } from './utils/range'
export { type ArrayElement } from './utils/array-element'
export {
  dateTimeFormatter,
  getBirthDayText,
  BirthDayInfo,
  getBirthdayInfo,
  formatDistanceWithAccuracy,
  formatDistanceWithFraction,
  formatDistanceTo,
} from './utils/date'
export { sleep, tickAsync } from './utils/sleep'
export { formatMoney } from './utils/money'
export {
  downloadFile,
  getBlobFromUrl,
  getFilename,
  FileMimeTypeExtension,
} from './utils/download'
export { extractErrorMessage } from './utils/error'
export {
  Navigation,
  NavigationAbsolute,
  NavigationProvider,
} from './Navigation/Navigation'
export { useTitle } from './hooks/use-title'
export { useQueryParams } from './hooks/use-query-params'
export {
  useClickOutside,
  useDoubleClickOutside,
} from './hooks/use-click-outside'
export { useKeyboardListener } from './hooks/keyboard/use-keyboard-listener'
export { useMediaQuery } from './hooks/use-media-query'

export {
  useKeyIsPressed,
  isPressing,
  shouldIgnoreInput,
  Keys,
  NumberKeys,
} from './hooks/keyboard/use-key-is-pressed'
export type Key = _Key
export { useVerticalKeyboardNavigation } from './hooks/keyboard/use-vertical-keyboard-navigation'
export {
  useConfirmDialog,
  ConfirmDialogProvider,
} from './Modal/use-confirm-dialog'
export { SidebarModal } from './Modal/SidebarModal'
export { ConfirmWithValueModal } from './Modal/ConfirmWithValueModal'

export { HotkeyHint, Hint } from './HotkeyHint'
export type HotkeyHintProps = _HotkeyHintProps

export type NavigationProps = _NavigationProps

export { Footer } from './Footer'

export { Popup } from './Popup/Popup'

export { useLocalStorage } from './hooks/use-local-storage'

export { PageManager } from './Pagination/PageManager'

export { PrettyPrintJSON } from './PrettyPrint/PrettyPrintJSON'

export { Portal } from './Portal/Portal'

export { Tag } from './Tag/Tag'
export { useSearchParamsState } from './hooks/use-search-params-state'

export { PopupButton, usePopupButton } from './PopupButton/PopupButton'

export { Collapsible } from './Collapsible/Collapsible'

export { useForwardRef } from './hooks/use-forward-ref'
export {
  useDisableInputWheel,
  useDisableInputUpDownKeys,
} from './hooks/use-disable-input-number-actions'

export { Switch, SwitchCard, SwitchCardInput } from './Switch/Switch'
