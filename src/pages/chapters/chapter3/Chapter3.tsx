import { useRef } from "react";
import { useChapter } from "../../../hooks/useChapter";
import { useNextStep } from "../../../hooks/useNextStep";
import { useTimer } from "../../../hooks/useTimer";
import { Part1Screen1 } from "./Part1Screen1";
import { Part1Screen2 } from "./Part1Screen2";
export default function Chapter3() {
  const ref = useRef<HTMLVideoElement>(null);

  const [second, reset] = useTimer();
  const nextStep = useNextStep();

  let part = 1;
  let screen: 1 | 2 = 1 as 1 | 2;

  if (second > 40) {
    nextStep();
  } else if (second > 20) {
    screen = 2;
  }

  console.log(second);

  useChapter(ref);

  let Component;
  switch (part) {
    case 1:
      switch (screen) {
        case 1:
          Component = Part1Screen1;
          break;
        case 2:
          Component = Part1Screen2;
          break;
        default:
          Component = Part1Screen1;
      }
      break;
    default:
      Component = Part1Screen1;
  }

  return <Component />;
}
