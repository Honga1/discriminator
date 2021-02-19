import { Grommet } from "grommet";
import React, { PropsWithChildren } from "react";
import { ModalSelector } from "../pages/modals/ModalSelector";
import { customTheme } from "../theme";

export const PageContainer = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Grommet theme={customTheme} full background="yellow">
      {children}
      <ModalSelector />
    </Grommet>
  );
};
