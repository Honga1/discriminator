import { Box } from "grommet";
import styled from "styled-components";
import { colorTheme } from "../theme";

export const CustomScrollbarBox = styled(Box)`
  &::-webkit-scrollbar {
    width: 20px;
  }

  &::-webkit-scrollbar-track {
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${colorTheme.yellowAlternative};
    outline-offset: -2px;
    outline: 2px solid ${colorTheme.black};
  }
`;
