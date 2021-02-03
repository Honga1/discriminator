import { ThemeType } from "grommet";

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
      black: "#202122",
      white: "#FFD237",
      red: "#E01010",
      blue: "#312DFF",
      green: "#168500",
      yellow: "#FFD237",
      background: { light: "#FFD237", dark: "#202122" },
      text: { light: "#2C2A21" },
    },
    font: {
      family: '"Roboto"',
      face:
        "/* cyrillic-ext */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu72xKOzY.woff2) format('woff2');\n  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;\n}\n/* cyrillic */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu5mxKOzY.woff2) format('woff2');\n  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;\n}\n/* greek-ext */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu7mxKOzY.woff2) format('woff2');\n  unicode-range: U+1F00-1FFF;\n}\n/* greek */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4WxKOzY.woff2) format('woff2');\n  unicode-range: U+0370-03FF;\n}\n/* vietnamese */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu7WxKOzY.woff2) format('woff2');\n  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;\n}\n/* latin-ext */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu7GxKOzY.woff2) format('woff2');\n  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;\n}\n/* latin */\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;\n}\n",
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
    level: {
      "1": {
        medium: {
          size: "48px",
          height: "56.25px",
        },
      },
    },
  },
  paragraph: {
    medium: {
      size: "32px",
      height: "48px",
      maxWidth: "768px",
    },
    small: {
      size: "16px",
      height: "24px",
      maxWidth: "768px",
    },
  },
  text: {
    small: {
      size: "16px",
      height: "24px",
      maxWidth: "768px",
    },
    medium: {
      size: "32px",
      height: "48px",
      maxWidth: "768px",
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
};
