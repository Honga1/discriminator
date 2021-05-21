import { Grommet } from "grommet";
import React, { PropsWithChildren } from "react";
import { ModalSelector } from "../modals/ModalSelector";
import { customTheme } from "../theme";

export const PageContainer = ({
  children,
  backgroundColor,
}: PropsWithChildren<{ backgroundColor: "yellow" | "black" }>) => {
  return (
    <Grommet
      theme={customTheme}
      style={{ width: "100%", height: "100%", overflowY: "auto" }}
      background={backgroundColor}
    >
      {children}
      <ModalSelector />
    </Grommet>
  );
};
