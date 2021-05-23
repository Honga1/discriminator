import { ThemeType } from "grommet";

export const colorTheme = {
  black: "#202122",
  white: "#FFFFFF",
  offWhite: "#F8F9FA",
  offWhiteOpaque: "rgba(248, 249, 250, 0.2)",
  lightGrey: "#A2A9B1",
  darkGrey: "#202122",
  red: "#E01010",
  redLight: "#FF5959",
  grayLight: "#A2A9B1",
  charcoal: "#2C2A21",
  blue: "#312DFF",
  blueLight: "#757AFF",
  green: "#168500",
  greenLight: "#20BF00",
  yellow: "#FFD700",
  yellowOpaque: "rgba(255, 215, 0, 0)",
  yellowAlternative: "#E8C100",
} as const;

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
      medium: "3px",
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
    xsmall: {
      size: "18px",
      height: "24px",
      maxWidth: undefined,
    },
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
  anchor: {
    color: colorTheme.blue,
    fontWeight: 400,
  },
};
