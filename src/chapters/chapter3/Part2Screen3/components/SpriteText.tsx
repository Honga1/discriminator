import { Text } from "grommet";
import { memo, useCallback, useEffect, useRef } from "react";
import { animated, to, useSpring } from "react-spring";
import { clamp } from "src/libs/math";
import { colorTheme } from "src/theme";
import styled from "styled-components";
import { part2Screen3Store } from "../store/part2Screen3Store";
import { TypingText } from "./TypingText";
import replaceAll from "string-replace-all-ponyfill";

export const SpriteText = memo(
  ({
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
    const ref = useRef<HTMLSpanElement>(null);
    const audio = useRef<HTMLAudioElement>(null);
    const [{ width }, api] = useSpring(() => ({
      width: "0%",
    }));

    useEffect(() => {
      const sprites = part2Screen3Store.getState().sprites;
      if (!sprites.has(ref)) {
        sprites.add(ref);
        part2Screen3Store.setState({ sprites: new Set([...sprites]) });
      }

      return () => {
        const sprites = part2Screen3Store.getState().sprites;
        sprites.delete(ref);
        part2Screen3Store.setState({ sprites: new Set([...sprites]) });
      };
    }, []);

    useEffect(() => {
      const audioInside = audio.current;
      const onTimeUpdate = () => {
        if (!audio.current) return;
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
    const onMouseEnter = useCallback(() => audio.current?.play(), []);
    const onMouseLeave = useCallback(() => {
      audio.current?.pause();
      if (audio.current) audio.current.currentTime = 0;
    }, []);
    return (
      <>
        <HoverText
          ref={ref}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{ position: "relative", whiteSpace: "nowrap", zIndex: 0 }}
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
          <audio
            ref={audio}
            controls={false}
            autoPlay={false}
            onPlay={(event) => {
              const thisElementIsPlaying =
                part2Screen3Store.getState().currentPlayingAudio ===
                event.currentTarget;

              if (thisElementIsPlaying) return;

              part2Screen3Store.getState().currentPlayingAudio?.pause();
              part2Screen3Store.setState({
                currentPlayingAudio: event.currentTarget,
              });
            }}
            onEnded={(event) => {
              const thisElementIsPlaying =
                part2Screen3Store.getState().currentPlayingAudio ===
                event.currentTarget;

              if (thisElementIsPlaying) {
                part2Screen3Store.setState({
                  currentPlayingAudio: undefined,
                });
              }
            }}
            onPause={(event) => {
              const thisElementIsPlaying =
                part2Screen3Store.getState().currentPlayingAudio ===
                event.currentTarget;

              if (thisElementIsPlaying) {
                part2Screen3Store.setState({
                  currentPlayingAudio: undefined,
                });
              }
            }}
          >
            <source src={audioSrc.ogg} type="audio/ogg" />
            <source src={audioSrc.caf} type="audio/x-caf" />
          </audio>
          <img
            style={{
              height: "1em",
              opacity: state === "SHOW_ALL" || state === "TYPING" ? 1 : 0,
              transform: "translateY(20%)",
            }}
            src={logoSrc}
            alt="logo"
          />
          &nbsp;&nbsp;&nbsp;
          <TypingText
            bold={false}
            text={replaceAll(text, " ", "\xa0")}
            state={state}
            onFinished={onFinished}
          />
        </HoverText>
        <TypingText
          bold={false}
          state={state}
          onFinished={() => {}}
          text={`   •••   `}
        />
      </>
    );
  }
);

const HoverText = styled(Text)`
  &:hover {
    cursor: help;
  }
`;

SpriteText.displayName = "SpriteText";
