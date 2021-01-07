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
                  <RoutedAnchor href="/chapter1" label={"chapter1"} />
                  <RoutedAnchor href="/chapter2" label={"chapter2"} />
                  <RoutedAnchor href="/chapter3" label={"chapter3"} />
                  <RoutedAnchor href="/chapter4" label={"chapter4"} />
                  <RoutedAnchor href="/chapter5" label={"chapter5"} />
                </AccordionPanel>
                <AccordionPanel label={<Anchor label="covers" />}>
                  <RoutedAnchor href="/cover1" label={"cover1"} />
                  <RoutedAnchor href="/cover2" label={"cover2"} />
                  <RoutedAnchor href="/cover3" label={"cover3"} />
                  <RoutedAnchor href="/cover4" label={"cover4"} />
                  <RoutedAnchor href="/cover5" label={"cover5"} />
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
