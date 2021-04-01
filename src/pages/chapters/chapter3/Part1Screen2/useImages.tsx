import { Image } from "grommet";
import React, { useMemo } from "react";
import styled from "styled-components";
import { images } from "./images/images";

const RevealableImage = styled(Image)<{ isShown?: boolean }>`
  width: 100%;
  object-fit: cover;
  height: 100%;
  transition: opacity 1s;
  opacity: ${(props) => (props.isShown ? 1 : 0)};
  backface-visibility: hidden;
  user-select: none;
  touch-action: none;

  &.auto-pickable {
  }

  &.is-picked {
    opacity: 1;
  }
`;
const years = [2006, 2007, 2010, 2011, 2012, 2013] as const;
export function useImages() {
  return useMemo(() => {
    const result = Object.fromEntries(
      years.map((year) => {
        const imagesThisYear = images.user.datasets.megaface.images.filter(
          ({ date }) => date.includes(year.toFixed())
        );
        return [
          year,
          {
            data: imagesThisYear,
            component: imagesThisYear.map(({ image_url }) => {
              return (
                <RevealableImage
                  src={image_url}
                  className="auto-pickable"
                  draggable={false}
                />
              );
            }),
          },
        ];
      })
    ) as Record<
      typeof years[number],
      {
        data: {
          image_url: string;
          path_alias: string;
          nsid: string;
          photo_id: number;
          license: string;
          date: string;
        }[];
        component: JSX.Element[];
      }
    >;
    return result;
  }, []);
}
