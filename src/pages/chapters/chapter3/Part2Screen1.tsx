import { Box, Grid, ResponsiveContext, Text } from "grommet";
import { useContext } from "react";

export const Part2Screen1 = () => {
  const isSmall = useContext(ResponsiveContext) === "small";

  const NormalLayout = (
    <Grid
      fill
      areas={[
        { name: "left-text", start: [0, 0], end: [0, 0] },
        { name: "left-center", start: [0, 1], end: [0, 1] },
        { name: "center", start: [1, 1], end: [1, 1] },
        { name: "right-center", start: [2, 1], end: [2, 1] },
        { name: "right-text", start: [2, 2], end: [2, 2] },
      ]}
      columns={["flex", "flex", "flex"]}
      rows={["96px", "flex", "96px"]}
      gap="48px"
    >
      <Box gridArea="center" justify="center" align="center">
        <AdamFaceCircle />
      </Box>
    </Grid>
  );

  const SmallLayout = (
    <Grid
      fill
      areas={[
        { name: "top", start: [0, 0], end: [0, 0] },
        { name: "middle", start: [0, 1], end: [0, 1] },
        { name: "bottom", start: [0, 2], end: [0, 2] },
      ]}
      columns={["flex"]}
      rows={["flex", "1/4", "flex"]}
      gap="32px"
      pad={{ horizontal: "16px", vertical: "32px" }}
    >
      <Box gridArea="middle" justify="center" align="center">
        <AdamFaceCircle />
      </Box>
    </Grid>
  );

  return (
    <Box height="100%" width="100%" justify="center" pad="48px">
      {isSmall ? SmallLayout : NormalLayout}
    </Box>
  );
};

const AdamFaceCircle = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 230 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="222" height="222" rx="111" fill="#202122" />
      <path
        d="M130.36 131.332H98.7881L91.6973 151H81.4492L110.227 75.6406H118.922L147.751 151H137.555L130.36 131.332ZM101.79 123.154H127.41L114.574 87.9072L101.79 123.154Z"
        fill="#F8F9FA"
      />
      <rect
        x="4"
        y="4"
        width="222"
        height="222"
        rx="111"
        stroke="#312DFF"
        strokeWidth="8"
      />
    </svg>
  );
};
