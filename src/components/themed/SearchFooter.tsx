import React, { useEffect } from 'react'

import { useHandler } from '../../hooks/useHandler'
import { useSceneFooterState } from '../../state/SceneFooterState'
import { SceneWrapperInfo } from '../common/SceneWrapper'
import { SearchIconAnimated } from '../icons/ThemedIcons'
import { Space } from '../layout/Space'
import { SceneFooterWrapper } from './SceneFooterWrapper'
import { SimpleTextInput, SimpleTextInputRef } from './SimpleTextInput'

interface SearchFooterProps {
  placeholder: string

  isSearching: boolean
  searchText: string

  noBackground?: boolean
  sceneWrapperInfo?: SceneWrapperInfo

  onChangeText: (value: string) => void
  onDoneSearching: () => void
  onLayoutHeight: (height: number) => void
  onStartSearching: () => void
}

export const SearchFooter = (props: SearchFooterProps) => {
  const { placeholder, isSearching, searchText, noBackground, sceneWrapperInfo, onChangeText, onDoneSearching, onLayoutHeight, onStartSearching } = props

  const textInputRef = React.useRef<SimpleTextInputRef>(null)

  const footerOpenRatio = useSceneFooterState(state => state.footerOpenRatio)
  const setKeepOpen = useSceneFooterState(state => state.setKeepOpen)

  //
  // Handlers
  //

  const handleSearchChangeText = useHandler((text: string) => {
    onChangeText(text)
  })

  const handleSearchBlur = useHandler(() => {
    if (searchText === '') {
      onDoneSearching()
    }
  })

  const handleSearchClear = useHandler(() => {
    if (!textInputRef.current?.isFocused()) {
      onDoneSearching()
    }
  })

  const handleSearchFocus = useHandler(() => {
    onStartSearching()
  })

  //
  // Effects
  //

  useEffect(() => {
    if (setKeepOpen != null) setKeepOpen(isSearching)
    if (isSearching && textInputRef.current) {
      textInputRef.current.focus()
    }
    if (!isSearching && textInputRef.current) {
      textInputRef.current.blur()
    }
  }, [isSearching, setKeepOpen])

  //
  // Renders
  //

  return (
    <SceneFooterWrapper noBackgroundBlur={noBackground} sceneWrapperInfo={sceneWrapperInfo} onLayoutHeight={onLayoutHeight}>
      <Space expand horizontal={1} vertical={0.5}>
        <SimpleTextInput
          returnKeyType="search"
          placeholder={placeholder}
          onChangeText={handleSearchChangeText}
          value={searchText}
          onBlur={handleSearchBlur}
          onClear={handleSearchClear}
          onFocus={handleSearchFocus}
          ref={textInputRef}
          iconComponent={SearchIconAnimated}
          scale={footerOpenRatio}
        />
      </Space>
    </SceneFooterWrapper>
  )
}