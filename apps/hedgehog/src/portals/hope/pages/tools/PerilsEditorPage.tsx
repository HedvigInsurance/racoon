import styled from '@emotion/styled'
import {
  Button,
  Dropdown,
  DropdownOption,
  MainHeadline,
  SecondLevelHeadline,
  TextArea,
  useTitle,
} from '@hedvig-ui'
import { OnBlurChangeInput } from '@hope/features/tools/perils-editor/inputs'
import { PerilIconOptions } from '@hope/features/tools/perils-editor/peril-icons'
import * as React from 'react'
import ReactDropZone from 'react-dropzone'
import { toast } from 'react-hot-toast'

const Wrapper = styled.div`
  padding: 2rem;
`

const PerilEditWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #fff;
  margin-bottom: 1rem;
`

const TitleWrapper = styled.div`
  padding-top: 1rem;
`

const CoverageWrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const CoverageItemWrapper = styled.div`
  display: flex;
`

const Coverage = styled.div`
  width: 50%;
  padding: 1rem;

  ${CoverageItemWrapper}, .input {
    width: 100%;
  }
`

const PERIL_CONTENTS_KEY = '_hvg:peril-contents'
const PERIL_FILE_KEY = '_hvg:peril-file-name'

interface Peril {
  title: string | { props: { children: string } }
  shortDescription: string
  description: string
  covered: string[]
  exceptions: string[]
  info: string
  icon: string
  iconName: string
}

const PerilsEditorPage: React.FC = () => {
  const [fileName, setFileName] = React.useState(() =>
    localStorage.getItem(PERIL_FILE_KEY),
  )
  const [contents, setContents] = React.useState(() =>
    localStorage.getItem(PERIL_CONTENTS_KEY),
  )
  const [parsedPerils, reallySetParsedPerils] =
    React.useState<ReadonlyArray<Peril> | null>(null)

  const setParsedPerils = (perils: ReadonlyArray<Peril>) => {
    reallySetParsedPerils(perils)
    localStorage.setItem(PERIL_CONTENTS_KEY, JSON.stringify(perils))
  }

  useTitle('Tools | Perils Editor')

  React.useEffect(() => {
    if (!contents) {
      return
    }

    setParsedPerils(JSON.parse(contents))
  }, [contents])

  const handleFileUpload = ([file]: File[]) => {
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (!event?.target?.result) {
        return
      }

      const result = event.target.result as string

      if (!isValidJson(result)) {
        toast.error('Unable to parse file')
        return
      }

      setContents(result)
      localStorage.setItem(PERIL_CONTENTS_KEY, result)
      setFileName(file.name)
      localStorage.setItem(PERIL_FILE_KEY, file.name)
    }
    reader.readAsText(file)
  }

  return (
    <Wrapper>
      <MainHeadline>📝 Perils editor</MainHeadline>
      <ReactDropZone
        onDrop={handleFileUpload}
        accept={{ 'application/json': [] }}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <Button {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragActive ? 'Drag file to edit' : 'Select file to edit'}
          </Button>
        )}
      </ReactDropZone>

      <SecondLevelHeadline>
        Edit <code>{fileName}</code>
        <a
          href={`data:application/json;charset=utf8,${encodeURIComponent(
            JSON.stringify(parsedPerils, null, 2),
          )}`}
          download={fileName}
        >
          Download file
        </a>
      </SecondLevelHeadline>
      <div>
        {parsedPerils &&
          parsedPerils.map((peril, index) => {
            const actualTitle =
              typeof peril.title === 'string'
                ? peril.title
                : peril.title.props.children

            const updateField = (field: string) => (value: unknown) => {
              setParsedPerils(
                parsedPerils.map((originalPeril, i_) => {
                  if (i_ === index) {
                    return { ...originalPeril, [field]: value }
                  }
                  return originalPeril
                }),
              )
            }

            return (
              <PerilEditWrapper key={actualTitle}>
                <OnBlurChangeInput
                  originalValue={actualTitle}
                  onUpdate={(newTitle) => {
                    updateField('title')(newTitle)
                  }}
                />
                <TitleWrapper>Short Description</TitleWrapper>
                <TextArea
                  value={peril.shortDescription}
                  onChange={({ currentTarget: { value } }) => {
                    updateField('shortDescription')(value)
                  }}
                />
                <TitleWrapper>Full Description</TitleWrapper>
                <TextArea
                  value={peril.description}
                  onChange={({ currentTarget: { value } }) => {
                    updateField('description')(value)
                  }}
                />

                <CoverageWrapper>
                  <Coverage>
                    Covered
                    {peril.covered.map((coveredText, coveredIndex) => (
                      <CoverageItemWrapper key={coveredText}>
                        <OnBlurChangeInput
                          originalValue={coveredText}
                          onUpdate={(newCoveredText) => {
                            updateField('covered')(
                              peril.covered.map((original, i_) => {
                                if (i_ === coveredIndex) {
                                  return newCoveredText
                                }
                                return original
                              }),
                            )
                          }}
                        />
                        <Button
                          status="danger"
                          onClick={() => {
                            updateField('covered')(
                              peril.covered.filter(
                                (_, i) => i !== coveredIndex,
                              ),
                            )
                          }}
                        >
                          &times;
                        </Button>
                      </CoverageItemWrapper>
                    ))}
                    <Button
                      status="success"
                      type="button"
                      onClick={() => {
                        updateField('covered')(peril.covered.concat(['']))
                      }}
                    >
                      + Add coverage
                    </Button>
                  </Coverage>
                  <Coverage>
                    Exceptions
                    {peril.exceptions.map((exceptionText, exceptionIndex) => (
                      <CoverageItemWrapper key={exceptionText}>
                        <OnBlurChangeInput
                          originalValue={exceptionText}
                          onUpdate={(newExceptionText) => {
                            updateField('exceptions')(
                              peril.exceptions.map((original, i_) => {
                                if (i_ === exceptionIndex) {
                                  return newExceptionText
                                }
                                return original
                              }),
                            )
                          }}
                        />
                        <Button
                          status="danger"
                          onClick={() => {
                            updateField('exceptions')(
                              peril.exceptions.filter(
                                (_, i) => i !== exceptionIndex,
                              ),
                            )
                          }}
                          type="button"
                        >
                          &times;
                        </Button>
                      </CoverageItemWrapper>
                    ))}
                    <Button
                      status="success"
                      type="button"
                      onClick={() => {
                        updateField('exceptions')(peril.exceptions.concat(['']))
                      }}
                    >
                      + Add exception
                    </Button>
                  </Coverage>
                </CoverageWrapper>

                <span>Add Icon</span>
                <Dropdown>
                  {PerilIconOptions.map((opt) => {
                    return (
                      <DropdownOption
                        key={opt.key}
                        selected={peril.iconName === opt.value}
                        onClick={() => {
                          updateField('iconName')(opt.value)
                        }}
                      >
                        <img alt="" src={opt.image.src} />
                        {opt.text}
                      </DropdownOption>
                    )
                  })}
                </Dropdown>

                <TitleWrapper>Info</TitleWrapper>
                <TextArea
                  value={peril.info}
                  onChange={({ currentTarget: { value } }) => {
                    updateField('info')(value)
                  }}
                />

                <Button
                  status="danger"
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        `Do you really want to delete the peril ${actualTitle}?`,
                      )
                    ) {
                      setParsedPerils(
                        parsedPerils.filter((_, i) => i !== index),
                      )
                    }
                  }}
                >
                  &times; Delete peril
                </Button>
              </PerilEditWrapper>
            )
          })}

        <Button
          type="button"
          status="success"
          onClick={() => {
            setParsedPerils(
              parsedPerils?.concat([
                {
                  title: '',
                  shortDescription: '',
                  description: '',
                  info: '',
                  exceptions: [],
                  covered: [],
                  icon: '',
                  iconName: '',
                },
              ]) ?? [],
            )
          }}
        >
          + Add peril
        </Button>
      </div>
    </Wrapper>
  )
}

const isValidJson = (thing: string): boolean => {
  try {
    JSON.parse(thing)
    return true
  } catch {
    return false
  }
}

export default PerilsEditorPage
