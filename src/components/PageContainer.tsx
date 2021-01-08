import { grommet, Grommet, ThemeType } from "grommet";
import { deepMerge } from "grommet/utils";
import { PropsWithChildren } from "react";
import { NavMenu } from "./NavMenu";

const customTheme: ThemeType = {
  tip: {
    content: {
      background: {
        color: "white",
      },
    },
  },
};

const mergedTheme = deepMerge(grommet, customTheme);

export const PageContainer = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Grommet theme={mergedTheme} full themeMode={"dark"}>
      <NavMenu />
      {children}
    </Grommet>
  );
};
