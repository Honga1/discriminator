import { Text } from "grommet";
import React, { Suspense } from "react";
import { Media } from "./MediaContainer";

const Cover5 = React.lazy(async () => import("./Cover1"));
const Cover4 = React.lazy(async () => import("./Cover1"));
const Cover3 = React.lazy(async () => import("./Cover1"));
const Cover2 = React.lazy(async () => import("./Cover2"));
const Cover1 = React.lazy(async () => import("./Cover1"));

export const Cover = ({ chapterNumber }: { chapterNumber: number }) => {
  let cover;

  switch (chapterNumber) {
    case 1:
      cover = <Cover1 />;
      break;
    case 2:
      cover = <Cover2 />;
      break;
    case 3:
      cover = <Cover3 />;
      break;
    case 4:
      cover = <Cover4 />;
      break;
    default:
      cover = <Cover5 />;
      break;
  }

  return (
    <Media>
      <Suspense fallback={<Text>Loading ...</Text>}>{cover}</Suspense>
    </Media>
  );
};
