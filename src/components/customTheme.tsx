import { ThemeType } from "grommet";
import { colorTheme } from "./colorTheme";

export const customTheme: ThemeType = {
  tip: {
    content: {
      background: {
        color: "white",
      },
    },
  },
  global: {
    colors: {
      ...colorTheme,
    },
    font: {
      family: "Roboto, sans-serif",
    },
    borderSize: {
      medium: "5px",
      small: "1px",
    },

    breakpoints: {
      small: {
        value: 767,
      },
      medium: {
        value: 1199,
      },
      large: {
        value: 1439,
      },
      xlarge: {},
    },
  },
  heading: {
    responsiveBreakpoint: undefined,
    level: {
      "1": {
        small: {
          size: "32px",
          height: "48px",
        },
        medium: {
          size: "48px",
          height: "56.25px",
        },
      },
      "2": {
        small: {
          size: "24px",
          height: "32px",
        },
      },
    },
    weight: 400,
  },
  paragraph: {
    small: {
      size: "24px",
      height: "32px",
      maxWidth: undefined,
    },
    medium: {
      size: "32px",
      height: "48px",
      maxWidth: undefined,
    },
  },
  text: {
    small: {
      size: "24px",
      height: "32px",
      maxWidth: undefined,
    },
    medium: {
      size: "32px",
      height: "48px",
      maxWidth: undefined,
    },
    "2xl?": {},
    "3xl?": {},
    "4xl?": {},
    "5xl?": {},
    "6xl?": {},
  },
  button: {
    border: {
      radius: "0",
      width: "3px",
    },
    padding: {
      horizontal: "30px",
      vertical: "10px",
    },
    size: {
      small: {
        border: {
          radius: "0",
        },
      },
    },
  },
  layer: {
    overlay: {
      background: {
        opacity: 0,
      },
    },
  },
};
