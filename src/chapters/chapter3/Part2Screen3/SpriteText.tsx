import { Text } from "grommet";
import { useEffect, useRef } from "react";
import { animated, to, useSpring } from "react-spring";
import { clamp } from "src/libs/math";
import { colorTheme } from "src/theme";
import { TypingText } from "./TypingText";

export const SpriteText = ({
  onFinished,
  state,
  logoSrc,
  audioSrc,
  text,
}: {
  text: string;
  onFinished: () => void;
  state: "SHOW_ALL" | "TYPING" | "SHOW_NONE";
  logoSrc: string;
  audioSrc: { caf: string; ogg: string };
}) => {
  const audio = useRef<HTMLAudioElement>(null);
  const [{ width }, api] = useSpring(() => ({
    width: "0%",
  }));

  useEffect(() => {
    const audioInside = audio.current;
    const onTimeUpdate = () => {
      if (!audio.current) return;
      console.log("herre");
      api.start({
        width:
          clamp(
            (audio.current.currentTime / audio.current.duration) * 100,
            0,
            100
          ) + "%",
      });
    };
    audio.current?.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audioInside?.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [api, audio]);
  return (
    <>
      <Text
        onMouseEnter={() => audio.current?.play()}
        onMouseLeave={() => {
          audio.current?.pause();
          if (audio.current) audio.current.currentTime = 0;
        }}
        style={{ position: "relative", whiteSpace: "nowrap" }}
      >
        <animated.div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            height: "10%",
            width: "100%",
            clipPath: to(
              [width],
              (width) => `polygon(0 0, ${width} 0, ${width} 100%, 0% 100%)`
            ),
            borderBottom: `4px dotted ${colorTheme.greenLight}`,
          }}
        />
        <audio ref={audio} controls={false} autoPlay={false}>
          <source src={audioSrc.ogg} type="audio/ogg" />
          <source src={audioSrc.caf} type="audio/x-caf" />
        </audio>
        <img
          style={{
            height: "1em",
            opacity: state === "SHOW_ALL" || state === "TYPING" ? 1 : 0,
          }}
          src={logoSrc}
          alt="logo"
        />
        &nbsp;&nbsp;&nbsp;
        <TypingText
          bold={false}
          text={text.replaceAll(" ", "\xa0")}
          state={state}
          onFinished={onFinished}
        />
      </Text>
      {`   •••   `}
    </>
  );
};
