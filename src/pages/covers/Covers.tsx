import React from "react";
import { CoverContainer } from "./CoverContainer";
import { Cover1 } from "./Cover1";
import { Cover2 } from "./Cover2";
import { Cover3 } from "./Cover3";
import { Cover4 } from "./Cover4";
import { Cover5 } from "./Cover5";

const covers = {
  1: <Cover1 />,
  2: <Cover2 />,
  3: <Cover3 />,
  4: <Cover4 />,
  5: <Cover5 />,
};

export const Covers = ({
  coverNumber,
}: {
  coverNumber: keyof typeof covers;
}) => {
  return (
    <CoverContainer coverNumber={coverNumber}>
      {covers[coverNumber]}
    </CoverContainer>
  );
};
