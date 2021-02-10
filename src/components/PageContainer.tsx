import { Grommet } from "grommet";
import { deepMerge } from "grommet/utils";
import React, { PropsWithChildren, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { customTheme } from "./customTheme";
import { ModalSelector } from "./ModalSelector";
import { NavMenu } from "./NavMenu";

const mergedTheme = deepMerge(customTheme);

export function useQuery() {
  const location = useLocation().search;
  return useMemo(() => new URLSearchParams(location), [location]);
}

export const PageContainer = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Grommet theme={mergedTheme} full>
      <NavMenu />
      {children}
      <ModalSelector />
    </Grommet>
  );
};
