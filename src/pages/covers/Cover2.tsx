import { Stack } from "grommet";
import React from "react";
import { WebcamPermissions } from "../../components/WebcamPermissions";

export const Cover2 = () => {
  return (
    <>
      <Stack alignSelf="center" guidingChild={"last"}></Stack>
      <WebcamPermissions />
    </>
  );
};
