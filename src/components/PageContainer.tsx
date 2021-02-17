import { Grommet } from "grommet";
import React, { PropsWithChildren } from "react";
import { ModalSelector } from "../pages/modals/ModalSelector";
import { customTheme } from "../theme";
import { NavMenu } from "./NavMenu";

export const PageContainer = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Grommet theme={customTheme} full background="yellow">
      <NavMenu />
      {children}
      <ModalSelector />
    </Grommet>
  );
};
