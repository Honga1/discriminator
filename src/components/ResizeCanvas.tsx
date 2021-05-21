import { Props, Canvas } from "@react-three/fiber";
import { ResizeObserver as ResizeObserverPolyfill } from "@juggle/resize-observer";

let maybePolyfill = window.hasOwnProperty("ResizeObserver")
  ? undefined
  : { polyfill: ResizeObserverPolyfill };

export const ResizeCanvas = (props: Props) => {
  return <Canvas {...props} resize={maybePolyfill}></Canvas>;
};
