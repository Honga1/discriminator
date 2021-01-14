import {
  Accordion,
  AccordionPanel,
  Anchor,
  Box,
  DropButton,
  Layer,
  Nav,
} from "grommet";
import { Menu } from "grommet-icons";
import { RoutedAnchor } from "./RoutedAnchor";

const chapterRoutes = [
  { url: "/chapter/1?body", label: "chapter 1" },
  { url: "/chapter/2?body", label: "chapter 2" },
  { url: "/chapter/3?body", label: "chapter 3" },
  { url: "/chapter/4?body", label: "chapter 4" },
  { url: "/chapter/5?body", label: "chapter 5" },
] as const;

const coverRoutes = [
  { url: "/chapter/1?cover", label: "cover 1" },
  { url: "/chapter/2?cover", label: "cover 2" },
  { url: "/chapter/3?cover", label: "cover 3" },
  { url: "/chapter/4?cover", label: "cover 4" },
  { url: "/chapter/5?cover", label: "cover 5" },
];

export const NavMenu = () => {
  return (
    <Layer modal={false} position="top-left" responsive={false}>
      <Box pad="small">
        <DropButton
          alignSelf="start"
          dropContent={
            <Nav direction="column" background="brand">
              <RoutedAnchor href="/" label={"home"} />
              <RoutedAnchor href="/coil" label={"coil"} />
              <RoutedAnchor href="/about" label={"about"} />
              <RoutedAnchor href="/privacy" label={"privacy"} />
              <RoutedAnchor href="/credits" label={"credits"} />
              <RoutedAnchor href="/error" label={"error"} />

              <Accordion animate direction="row">
                <AccordionPanel label={<Anchor label="chapters" />}>
                  {chapterRoutes.map(({ url, label }) => (
                    <RoutedAnchor href={url} label={label} key={url} />
                  ))}
                </AccordionPanel>
                <AccordionPanel label={<Anchor label="covers" />}>
                  {coverRoutes.map(({ url, label }) => (
                    <RoutedAnchor href={url} label={label} key={url} />
                  ))}
                </AccordionPanel>
              </Accordion>
            </Nav>
          }
        >
          <Menu />
        </DropButton>
      </Box>
    </Layer>
  );
};
