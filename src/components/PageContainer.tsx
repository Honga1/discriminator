import { Grommet } from "grommet";
import { deepMerge } from "grommet/utils";
import React, { PropsWithChildren } from "react";
import { customTheme } from "./customTheme";
import { ModalSelector } from "./ModalSelector";
import { NavMenu } from "./NavMenu";

const mergedTheme = deepMerge(customTheme);

export const PageContainer = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Grommet theme={mergedTheme} full background="yellow">
      <NavMenu />
      {children}
      <ModalSelector />
    </Grommet>
  );
};
