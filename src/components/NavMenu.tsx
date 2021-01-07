import { Accordion, AccordionPanel, Anchor, Nav } from "grommet";

export const NavMenu = () => {
  return (
    <Nav direction="row" background="brand">
      <Anchor label="home" href="/" />
      <Anchor label="coil" href="/coil" />
      <Anchor label="about" href="/about" />
      <Anchor label="privacy" href="/privacy" />
      <Anchor label="credits" href="/credits" />
      <Anchor label="error" href="/error" />

      <Accordion animate direction="row">
        <AccordionPanel label={<Anchor label="chapters" />}>
          <Anchor label="chapter1" href="/chapter1" />
          <Anchor label="chapter2" href="/chapter2" />
          <Anchor label="chapter3" href="/chapter3" />
          <Anchor label="chapter4" href="/chapter4" />
          <Anchor label="chapter5" href="/chapter5" />
        </AccordionPanel>
        <AccordionPanel label={<Anchor label="covers" />}>
          <Anchor label="cover1" href="/cover1" />
          <Anchor label="cover2" href="/cover2" />
          <Anchor label="cover3" href="/cover3" />
          <Anchor label="cover4" href="/cover4" />
          <Anchor label="cover5" href="/cover5" />
        </AccordionPanel>
      </Accordion>
    </Nav>
  );
};
