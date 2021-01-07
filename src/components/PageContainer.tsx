import { grommet, Grommet } from "grommet";
import { PropsWithChildren } from "react";
import { NavMenu } from "./NavMenu";

export const PageContainer = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Grommet theme={grommet} full>
      <NavMenu />
      {children}
    </Grommet>
  );
};
