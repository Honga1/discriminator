import { Box } from "grommet";
import { memo } from "react";
import { FadeOutBox } from "./FadeOutBox";

export const ScrollBanner = memo(({ isShown }: { isShown: boolean }) => {
  return (
    <FadeOutBox
      height="145px"
      style={{
        position: "absolute",
        pointerEvents: "none",
        background:
          "linear-gradient(180deg, rgba(32, 33, 34, 0) 0%, #202122 100%)",
        bottom: 0,
        left: 0,
        right: 0,
      }}
      align="center"
      justify="center"
      isShown={isShown}
    >
      <ChevronDown />
    </FadeOutBox>
  );
});

ScrollBanner.displayName = "ScrollBanner";

const ChevronDown = memo(() => {
  return (
    <Box width="80px" height="80px" flex={false}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 80 81"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.4739 25.5L15.0005 32.9734L39.912 57.8849L39.9999 57.797L40.0879 57.885L64.9994 32.9735L57.5259 25.5L39.9999 43.026L22.4739 25.5Z"
          fill="#20BF00"
        />
      </svg>
    </Box>
  );
});

ChevronDown.displayName = "ChevronDown";
