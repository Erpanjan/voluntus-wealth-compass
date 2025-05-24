
import { useState } from 'react';

export const useEditorState = () => {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imagePopoverOpen, setImagePopoverOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPopoverOpen, setVideoPopoverOpen] = useState(false);
  const [fontOptionsOpen, setFontOptionsOpen] = useState(false);
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false);
  const [lineHeightPopoverOpen, setLineHeightPopoverOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  return {
    linkUrl,
    setLinkUrl,
    linkPopoverOpen,
    setLinkPopoverOpen,
    imageUrl,
    setImageUrl,
    imagePopoverOpen,
    setImagePopoverOpen,
    videoUrl,
    setVideoUrl,
    videoPopoverOpen,
    setVideoPopoverOpen,
    fontOptionsOpen,
    setFontOptionsOpen,
    colorPopoverOpen,
    setColorPopoverOpen,
    lineHeightPopoverOpen,
    setLineHeightPopoverOpen,
    isFullscreen,
    toggleFullscreen,
  };
};
