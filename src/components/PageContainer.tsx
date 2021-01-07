import { Grommet } from "grommet";
import { PropsWithChildren } from "react";
import { NavMenu } from "./NavMenu";

export const PageContainer = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Grommet>
      <NavMenu />
      {children}
    </Grommet>
  );
};
