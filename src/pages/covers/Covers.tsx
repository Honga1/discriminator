import { Text } from "grommet";
import React, { Suspense } from "react";
import { Media } from "./MediaContainer";

export const Cover = ({ chapterNumber }: { chapterNumber: number }) => {
  let cover;

  switch (chapterNumber) {
    case 1:
      const Cover1 = React.lazy(async () => import("./Cover1"));
      cover = <Cover1 />;
      break;
    case 2:
      const Cover2 = React.lazy(async () => import("./Cover1"));
      cover = <Cover2 />;
      break;
    case 3:
      const Cover3 = React.lazy(async () => import("./Cover1"));
      cover = <Cover3 />;
      break;
    case 4:
      const Cover4 = React.lazy(async () => import("./Cover1"));
      cover = <Cover4 />;
      break;
    default:
      const Cover5 = React.lazy(async () => import("./Cover1"));
      cover = <Cover5 />;
      break;
  }

  return (
    <Media>
      <Suspense fallback={<Text>Loading ...</Text>}>{cover}</Suspense>
    </Media>
  );
};
