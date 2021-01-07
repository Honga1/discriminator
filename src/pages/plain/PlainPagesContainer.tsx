import { Box, Grid } from "grommet";
import { PropsWithChildren } from "react";

export const PlainPageContainer = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box pad="medium">
      <Grid
        areas={[
          { name: "left", start: [0, 0], end: [0, 0] },
          {
            name: "center",
            start: [1, 0],
            end: [1, 0],
          },
          {
            name: "right",
            start: [2, 0],
            end: [2, 0],
          },
        ]}
        columns={["flex", "auto", "flex"]}
        rows={["auto"]}
      >
        <Box gridArea="center" width={{ max: "800px" }}>
          {children}
        </Box>
      </Grid>
    </Box>
  );
};
