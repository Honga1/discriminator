import { Grommet } from "grommet";
import React, { PropsWithChildren } from "react";
import { ModalSelector } from "../pages/modals/ModalSelector";
import { customTheme } from "../theme";

export const PageContainer = ({
  children,
  backgroundColor,
}: PropsWithChildren<{ backgroundColor: "yellow" | "black" }>) => {
  return (
    <Grommet theme={customTheme} full background={backgroundColor}>
      {children}
      <ModalSelector />
    </Grommet>
  );
};
