export interface IMediaElement extends EventTarget {
  addEventListener: (
    event:
      | "click"
      | "playing"
      | "pause"
      | "timeupdate"
      | "play"
      | "playing"
      | "ended",
    listener: (event: Event) => void
  ) => void;
  removeEventListener: (
    event:
      | "click"
      | "playing"
      | "pause"
      | "timeupdate"
      | "play"
      | "playing"
      | "ended",
    listener: (event: Event) => void
  ) => void;
  play: () => void;
  pause: () => void;
  currentTime: number;
  paused: boolean;
  ended: boolean;
  /**
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
   * Values from 0 - 4
   */
  readyState: number;
  duration: number;
}

export {};
