import { Grommet } from "grommet";
import { deepMerge } from "grommet/utils";
import { PropsWithChildren } from "react";
import { customTheme } from "./customTheme";
import { NavMenu } from "./NavMenu";

const mergedTheme = deepMerge(customTheme);

export const PageContainer = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Grommet theme={mergedTheme} full themeMode={"light"}>
      <NavMenu />
      {children}
    </Grommet>
  );
};
