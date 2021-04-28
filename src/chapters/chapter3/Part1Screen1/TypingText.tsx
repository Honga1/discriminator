import { Text } from "grommet";
import { Fragment } from "react";
import styled from "styled-components";

export function TypingText({ isStarted }: { isStarted: boolean }) {
  const etherWorksText = [..."ETHER\nWORKS"];
  return (
    <StyledTypingText
      textAlign="start"
      size={"48px"}
      style={{
        lineHeight: "48px",
      }}
    >
      {etherWorksText
        .map((character, index) => {
          if (character === "\n") return <br key={index}></br>;
          return [<Fragment key={index}>&nbsp;</Fragment>, character];
        })
        .map((element, index) => (
          <span
            key={index}
            className={`letter letter-${index} ${
              isStarted ? "shown" : "hidden"
            }`}
          >
            {element}
          </span>
        ))}
    </StyledTypingText>
  );
}
const StyledTypingText = styled(Text)`
  & .letter {
    transition: opacity 0.2s ease-in-out;
    opacity: 0;
  }

  //E
  & .letter.letter-0 {
    transition-delay: 0s;
  }

  & .letter.shown {
    opacity: 1 !important;
  }

  & .letter.hidden {
    opacity: 0;
    transition-delay: 0s !important;
  }

  //T
  & .letter.letter-1 {
    transition-delay: 1s;
  }

  //H
  & .letter.letter-2 {
    transition-delay: 1.2s;
  }

  //E
  & .letter.letter-3 {
    transition-delay: 1.65s;
  }

  //R
  & .letter.letter-4 {
    transition-delay: 1.75s;
  }

  // New Line
  & .letter.letter-5 {
    transition-delay: 2s;
  }
  //W
  & .letter.letter-6 {
    transition-delay: 3s;
  }

  //O
  & .letter.letter-7 {
    transition-delay: 3.3s;
  }

  //R
  & .letter.letter-8 {
    transition-delay: 3.6s;
  }

  //K
  & .letter.letter-9 {
    transition-delay: 4.3s;
  }
  //S
  & .letter.letter-10 {
    transition-delay: 4.6s;
  }
`;
