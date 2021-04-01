import { Image } from "grommet";
import React, { useMemo } from "react";
import styled from "styled-components";

const RevealableImage = styled(Image)<{ isShown?: boolean }>`
  width: 100%;
  object-fit: cover;
  height: 100%;
  transition: opacity 1s;
  opacity: ${(props) => (props.isShown ? 1 : 0)};
  backface-visibility: hidden;

  &.auto-pickable {
  }

  &.is-picked {
    opacity: 1;
  }
`;
export function useImages() {
  return useMemo(() => {
    const images2006 = [
      <RevealableImage
        className="auto-pickable"
        src="https://picsum.photos/200/300"
      />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
    ];
    const images2007 = [
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage
        className="auto-pickable"
        src="https://picsum.photos/200/300"
      />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
    ];
    const images2010 = [
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage
        className="auto-pickable"
        src="https://picsum.photos/200/300"
      />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
    ];
    const images2011 = [
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage
        className="auto-pickable"
        src="https://picsum.photos/200/300"
      />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
    ];
    const images2012 = [
      <RevealableImage src="https://picsum.photos/200/300" />,
    ];
    const images2013 = [
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
      <RevealableImage
        className="auto-pickable"
        src="https://picsum.photos/200/300"
      />,
      <RevealableImage src="https://picsum.photos/100/100" />,
      <RevealableImage src="https://picsum.photos/200/300" />,
    ];
    return {
      images2006,
      images2007,
      images2010,
      images2011,
      images2012,
      images2013,
    };
  }, []);
}
