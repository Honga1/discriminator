import { Box, Button, ButtonType, ResponsiveContext, Timeout } from "grommet";
import { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import { colorTheme } from "../../theme";

export function ShowMenuButton(props: {
  setHasTimeoutElapsed: (arg0: boolean) => void;
  setIsOpen: (arg0: boolean) => void;
  isOpen: boolean;
}) {
  const timeout = useRef<Timeout>();
  const isSmall = useContext(ResponsiveContext) === "small";
  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = undefined;
    };
  });
  return (
    <Box align="center" justify="center">
      <ThreeDotsMenuButton
        isOpen={props.isOpen}
        onMouseEnter={() => {
          if (isSmall) return;
          if (timeout.current) clearTimeout(timeout.current);
          props.setHasTimeoutElapsed(false);
          timeout.current = setTimeout(
            () => props.setHasTimeoutElapsed(true),
            4000
          ) as unknown as Timeout;
          props.setIsOpen(true);
        }}
        onClick={() => {
          props.setIsOpen(!props.isOpen);
        }}
      />
    </Box>
  );
}

function ThreeDotsMenuButton({
  isOpen,
  ...buttonProps
}: ButtonType & { isOpen: boolean }) {
  return (
    <Button
      {...buttonProps}
      plain
      label={
        <Box
          width="64px"
          height="32px"
          direction="row"
          flex={false}
          justify="between"
          align="center"
          style={{ pointerEvents: "auto" }}
        >
          <StyledDot
            width="14px"
            height="14px"
            style={{ borderRadius: "50%", transition: "background 0.6s" }}
            border={{ color: colorTheme.offWhite, size: "2px" }}
            background={!isOpen ? colorTheme.yellow : "none"}
          />
          <StyledDot
            width="14px"
            height="14px"
            style={{ borderRadius: "50%", transition: "background 0.6s" }}
            border={{ color: colorTheme.offWhite, size: "2px" }}
            background={!isOpen ? colorTheme.yellow : "none"}
          />
          <StyledDot
            width="14px"
            height="14px"
            style={{ borderRadius: "50%", transition: "background 0.6s" }}
            border={{ color: colorTheme.offWhite, size: "2px" }}
            background={!isOpen ? colorTheme.yellow : "none"}
          />
        </Box>
      }
    />
  );
}
const StyledDot = styled(Box)`
  box-shadow: 0px 0px 10.4167px rgba(0, 0, 0, 0.3);
`;
