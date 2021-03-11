import { useRef } from "react";
import { useChapter } from "../../../hooks/useChapter";
import { Part1Screen1 } from "./Part1Screen1";
import { Part1Screen2 } from "./Part1Screen2";
export default function Chapter3() {
  const ref = useRef<HTMLVideoElement>(null);
  useChapter(ref);

  const part = 1;
  const screen: 1 | 2 = 2 as 1 | 2;
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
