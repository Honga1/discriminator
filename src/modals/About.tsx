import { Anchor, Image, ResponsiveContext, Text } from "grommet";
import React, { useContext } from "react";

import acLogo from "src/images/arts-council-logo.png";
import ccaLogo from "src/images/cca-logo.png";
import creativeBCLogo from "src/images/creative-bc-logo.png";
import gftwLogo from "src/images/gftw-logo.svg";

export const About = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  const isSmall = size === "small";
  const textSize = isSmall ? "20px" : "24px";
  const lineHeight = isSmall ? "30px" : "36px";

  return (
    <>
      <Text size={textSize} color="black" style={{ lineHeight }}>
        Discriminator is a production of Imposter Media, Inc.
        <br />
        <br />
        Written & Directed by Brett Gaylor
        <br />
        <br />
        Animation by Darren Pasemko & Kent Hugo
        <br />
        <br />
        Music by David Drury
        <br />
        <br />
        Research by Adam Harvey
        <br />
        <br />
        Web Development by Jae Perris
        <br />
        <br />
        Web Design by Hang Do Thi Duc
        <br />
        <br />
        Archival research by Shelley Baart-Gaylor
        <br />
        <br />
        Developed with the participation of Creative BC and the British Columbia
        Arts Council
        <br />
        <br />
        <Anchor href="https://www.creativebc.com/" target="_blank">
          <Image src={creativeBCLogo} width="300px" />
        </Anchor>
        <br />
        <br />
        <Anchor href="https://www.bcartscouncil.ca/" target="_blank">
          <Image src={acLogo} width="300px" />
        </Anchor>
        <br />
        <br />
        We acknowledge the support of the Canada Council for the Arts.
        <br />
        <br />
        <Anchor href="https://canadacouncil.ca/" target="_blank">
          <Image src={ccaLogo} width="300px" />
        </Anchor>
        <br />
        <br />
        With support from Grant For The Web
        <br />
        <br />
        <Anchor href="https://www.grantfortheweb.org/" target="_blank">
          <Image src={gftwLogo} width="200px" />
        </Anchor>
        <br />
        <br />
        Software & Libraries used
        <br />
        <ul>
          <li>React</li>
          <li>React Three Fiber</li>
          <li>Drei</li>
          <li>Zustand</li>
          <li>wav2lip</li>
          <li>Tensorflow JS</li>
          <li>PyTorch</li>
          <li>Grommet</li>
          <li>Dash.js</li>
        </ul>
        <br />
        <br />
        References
        <br />
        The following works of research and journalism shape this project:
        <br />
        <ul>
          <li>
            <Anchor href="http://gendershades.org/" target="_blank">
              GenderShades
            </Anchor>{" "}
            - Joy Boulamwini
          </li>
          <li>
            <Anchor
              href="https://points.datasociety.net/the-point-of-collection-8ee44ad7c2fa#79b1"
              target="_blank"
            >
              The Point of Collection
            </Anchor>{" "}
            - Mimi Onuoha
          </li>
          <li>
            <Anchor
              href="https://www.nbcnews.com/tech/internet/facial-recognition-s-dirty-little-secret-millions-online-photos-scraped-n981921"
              target="_blank"
            >
              Facial recognition’s dirty little secret
            </Anchor>{" "}
            - Oliva Solon
          </li>
          <li>
            <Anchor href="http://www.exposing.ai">Exposing.ai</Anchor> - Adam
            Harvey
          </li>
        </ul>
        <br />
        <br />
        Images used:
        <table>
          <tbody>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.freeimg.net/photo/934716/grass-blender-3d"
                >
                  grass‌ ‌blender‌ ‌3d‌
                </Anchor>
              </td>
              <td>FreeIMG‌</td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://commons.wikimedia.org/wiki/File:AirBletterbach_(3D_S%C3%BCdtirol)_16.jpg"
                >
                  AirBletterbach‌
                </Anchor>
              </td>
              <td>Wikimedia‌ ‌Commons‌ ‌</td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/beigephotos/327265310/in/photostream/"
                >
                  Inside‌ ‌Computer‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/beigephotos/"
                >
                  Michael‌ ‌Pereckas‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor target="_blank" href="https://pixy.org/318447/">
                  Anime‌ ‌boy‌ ‌face‌ ‌drawing‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixy.org/author/Oda_Gerdes/"
                >
                  Oda‌ ‌Gerdes‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor target="_blank" href="https://pixy.org/5709971/">
                  Silver‌ ‌Surfer‌
                </Anchor>
              </td>
              <td>
                <Anchor target="_blank" href="https://pixy.org/318447/">
                  Pixy#org‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor target="_blank" href="https://pixy.org/6405906/">
                  Elf‌
                </Anchor>
              </td>
              <td>
                <Anchor target="_blank" href="https://pixy.org/318447/">
                  Pixy#org‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor target="_blank" href="https://pixy.org/4857720/">
                  Alien‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixy.org/author/Kathline_Meszaros/"
                >
                  Kathline‌ ‌Meszaros‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor target="_blank" href="https://pixy.org/5901914/">
                  CG‌ ‌Fairy‌
                </Anchor>
              </td>
              <td>
                <Anchor target="_blank" href="https://pixy.org/318447/">
                  Pixy#org‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/illustrations/troll-kobold-fantasy-ears-3331618/"
                >
                  Troll‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/users/anaterate-2348028/"
                >
                  anaterate‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/illustrations/man-stand-drinkers-alcoholics-5272165/"
                >
                  Alcoholic‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/users/anaterate-2348028/"
                >
                  anaterate‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/illustrations/spirit-ghost-creepy-halloween-4521629/"
                >
                  Creepy‌ ‌Ghost‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/users/anaterate-2348028/"
                >
                  anaterate‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/illustrations/siamese-cat-pet-cute-animal-5559874/"
                >
                  Cat‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/users/lizdunbar-935811/"
                >
                  Lizdunbar‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/gcfairch/4283749618/"
                >
                  Ryan's‌ ‌Creepy‌ ‌Face‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/gcfairch/"
                >
                  Geoffrey‌ ‌Fairchild‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/kessiye/7021407685/sizes/o/"
                >
                  Upside‌ ‌Down‌ ‌Hair‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/kessiye/"
                >
                  Ben‌ ‌Francis‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/volvob12b/39596247290/in/photolist-23jZ7NN-MChowJ-GedZbi-25GRMNV-22fLrVd-wikMk7-LWrwG3-RzEkvE-25sK6oE-Una7VZ-22jsra7-26cQfJz-2arhcDV-J54Wff-25V6FVm-2aLdyCg-Z3fSUa-24rQnu3-27ocqro-25sK7FQ-24h4faA-21zZzoY-dKuGab-dK8vbe-HDG3de-22YEntT-EFSgq8-255qjHp-EFSoGn-255qgzR-22LCnXu-RKhHKq-25Dc39z-24kXUAR-24rQkW3-YY4BbC-24h45uo-bNajqT-YZvjtN-dP69oF-22YEdbe-23ZFDFL-JSPPKN-Z3GGwW-YDvSsW-GWFkkj-22LCqw7-2f7WrRS-QC7rgr-dMstfG"
                >
                  New‌ ‌Zealand‌ ‌fantail‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/volvob12b/"
                >
                  Bernard‌ ‌Spragg.‌ ‌NZ‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/volvob12b/29946645998/in/photolist-23jZ7NN-MChowJ-GedZbi-25GRMNV-22fLrVd-wikMk7-LWrwG3-RzEkvE-25sK6oE-Una7VZ-22jsra7-26cQfJz-2arhcDV-J54Wff-25V6FVm-2aLdyCg-Z3fSUa-24rQnu3-27ocqro-25sK7FQ-24h4faA-21zZzoY-dKuGab-dK8vbe-HDG3de-22YEntT-EFSgq8-255qjHp-EFSoGn-255qgzR-22LCnXu-RKhHKq-25Dc39z-24kXUAR-24rQkW3-YY4BbC-24h45uo-bNajqT-YZvjtN-dP69oF-22YEdbe-23ZFDFL-JSPPKN-Z3GGwW-YDvSsW-GWFkkj-22LCqw7-2f7WrRS-QC7rgr-dMstfG/"
                >
                  Variable‌ ‌oystercatcher‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/volvob12b/"
                >
                  Bernard‌ ‌Spragg.‌ ‌NZ‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/totallywired/1508254261/"
                >
                  Burned‌ ‌Out‌ ‌Car‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/totallywired/"
                >
                  keren‌ ‌richter‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/hodgers/487098084/"
                >
                  Car‌ ‌Accident‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/hodgers/"
                >
                  Tom‌ ‌Hodgkinson‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/rvaphotodude/2295245100/"
                >
                  Art‌ ‌Car‌ ‌1‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/rvaphotodude/"
                >
                  vaphotodude‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/rabble/41232736/"
                >
                  Art‌ ‌Car‌ ‌2‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/rabble/"
                >
                  rabble‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/rtds/17325790/"
                >
                  House‌ ‌of‌ ‌Balls‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/rtds/"
                >
                  Ruth‌ ‌Temple‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/40943981@N00/3294903851/"
                >
                  Camera‌ ‌Car‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/40943981@N00/"
                >
                  w.marsh‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/40943981@N00/3294904603/"
                >
                  Art‌ ‌Car‌ ‌3‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/40943981@N00/"
                >
                  w.marsh‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/smercury98/3531371982/"
                >
                  Art‌ ‌Car‌ ‌4‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/smercury98/"
                >
                  Sarah‌ ‌Laval‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/12485267@N06/3328707552/"
                >
                  Burned‌ ‌Out‌ ‌Car‌ ‌02‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/12485267@N06/"
                >
                  David365‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/learnscope/7333827836/"
                >
                  Doodle‌ ‌Car‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/learnscope/"
                >
                  Robyn‌ ‌Jay‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/mutt/14647006516/"
                >
                  Lambo‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/mutt/"
                >
                  Herm‌ ‌Baskerville‌
                </Anchor>
              </td>
            </tr>

            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/scottfeldstein/88943384/"
                >
                  Old‌ ‌Ambulance‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/scottfeldstein/"
                >
                  Scott‌ ‌Feldstein‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/69709362@N00/14214013124/"
                >
                  Old‌ ‌Police‌ ‌Car‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/69709362@N00/"
                >
                  lbinic‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/photos/car-crushed-art-modern-sculpture-626792/"
                >
                  Crushed‌ ‌Car‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/users/desertrose7-752536/"
                >
                  Desertrose7‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/photos/art-gallery-canvas-arts-gallery-699429/"
                >
                  Art‌ ‌Gallery‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/users/stocksnap-894430/"
                >
                  StockSnap‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://commons.wikimedia.org/wiki/File:Isometric_graph_paper_YP.png"
                >
                  Isometric‌ ‌graph‌ ‌paper‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://commons.wikimedia.org/wiki/User_talk:Yamaplos"
                >
                  Yamaplos‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://commons.wikimedia.org/wiki/File:Graph_paper_inch_green_Letter.svg"
                >
                  Graph‌ ‌paper‌ ‌inch‌ ‌green‌ ‌Letter‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://commons.wikimedia.org/wiki/User:Nl74"
                >
                  László‌ ‌Németh‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/slopjop/2074044865/in/photolist-4ah2he-Vo2C-4Lwb-3KqQF-7Qkg-4C8b-iNRE-KEeeq-64uG-4LsC-3KqQH-848TWZ-87RrGH-2kdat-8cB2qm-84aY2U-4LsD-amJ75R-3KiR3-4Lsz-3KiR5-4C8m-3KiR4-3Ki35-76LjbD-dwACdB-4NqDNy-o311Y9-pxnW5E-5ujViY-2kqg4g5-gDWK9t-AjsLLK-9qP1aj-9qP19E-9qL1jF-9qP1a7-9qP19w-9qP19N-9qL1m4-9qP19m-agoVb5-4SEZ-2e319-KEeeA-4RHY-2ejXK-4SpK-fqbfv-3Ki36"
                >
                  The‌ ‌many‌ ‌faces‌ ‌of‌ ‌Mary‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/slopjop/"
                >
                  Clay‌ ‌Junell‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/joshua/493073495/in/photolist-Kz8za-5svPgc-8djfK8-8UBCPi-84c5MG-2jiuhwe-5t7eMP-8djgka-KCiCC-5VFmj7-3Ki38-2xxxL-2mwrP-4RLe-3bz5W-2kH9f-2noVh-2nbyi-qitLjM-8LcXkt-svwX-7Uh29E-dX22u-3KitM-2pNg4-7gXC4N-2nnvk-2vT23-2mFhq-KEefw-2vGxo-uzybXP-4Cky-2pZBZ-2kGBJ-4Np6cd-KEeeh-76vfjE-4C8f-4ae7Et-4NpPv3-4C8h-2nvFp-KEpfZ-2mpF4-hM1mm-4SwR-o2Ny6k-KEefJ-4Lwh"
                >
                  Faces‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/joshua/"
                >
                  Joshua‌ ‌Rappeneker‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/slopjop/2073477639/in/photolist-Kz8za-5svPgc-8djfK8-8UBCPi-84c5MG-2jiuhwe-5t7eMP-8djgka-KCiCC-5VFmj7-3Ki38-2xxxL-2mwrP-4RLe-3bz5W-2kH9f-2noVh-2nbyi-qitLjM-8LcXkt-svwX-7Uh29E-dX22u-3KitM-2pNg4-7gXC4N-2nnvk-2vT23-2mFhq-KEefw-2vGxo-uzybXP-4Cky-2pZBZ-2kGBJ-4Np6cd-KEeeh-76vfjE-4C8f-4ae7Et-4NpPv3-4C8h-2nvFp-KEpfZ-2mpF4-hM1mm-4SwR-o2Ny6k-KEefJ-4Lwh/"
                >
                  The‌ ‌many‌ ‌faces‌ ‌of‌ ‌myself‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/slopjop/"
                >
                  Clay‌ ‌Junell‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/a_mason/3474528/in/photolist-iNRE-KEeeq-o2Ny6k-64uG-4LsC-3KqQH-848TWZ-87RrGH-2kdat-8cB2qm-84aY2U-4LsD-KEefJ-3KiR3-3KiR4-4Lsz-3KiR5-4C8m-3Ki35-4SEZ-2e319-KEeeA-76LjbD-4RHY-2ejXK-4SpK-fqbfv-3Ki36-dwACdB-4C8j-84cASj-4NqDNy-o311Y9-pxnW5E-27kqz9-xx34a-76wSjh-3Ki39-6RNg-27krfQ-6Xwt-8Px9HB-27fYZt-KEegU-592a-6bKZ-53xM-27fXti-3KitP-7QhV"
                >
                  Many‌ ‌faces‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/a_mason/"
                >
                  Andrew‌ ‌Mason‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://commons.wikimedia.org/wiki/File:Morphing_madness.jpg"
                >
                  Morphing‌ ‌madness‌
                </Anchor>
              </td>
              <td>Edward‌ ‌Webb‌ ‌</td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/istolethetv/2957629506/"
                >
                  Pig‌ ‌People‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/istolethetv/"
                >
                  istolethetv‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/bootbearwdc/6282069332/"
                >
                  Dog‌ ‌Face‌ ‌Paint‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/bootbearwdc/"
                >
                  bootbearwdc‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/usacehq/5839708549/"
                >
                  Safety‌ ‌Scooby‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/usacehq/"
                >
                  U.S.‌ ‌Army‌ ‌Corps‌ ‌of‌ ‌Engineers‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/kenwalton/37617413055/"
                >
                  Dressed‌ ‌as‌ ‌My‌ ‌Dog‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/kenwalton/"
                >
                  Ken‌ ‌Walton‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/petsadviser-pix/8126536591/"
                >
                  Headless‌ ‌Ghost‌ ‌Dogs‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/petsadviser-pix/"
                >
                  Petful‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/131436887@N07/28187329307/"
                >
                  Furry‌ ‌Halloween‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/131436887@N07/"
                >
                  Univaded‌ ‌Fox‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/foilman/5906443080/"
                >
                  baby‌ ‌photo‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/foilman/"
                >
                  Henry‌ ‌Burrows‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/149561324@N03/42776493594/"
                >
                  Russian‌ ‌Football‌ ‌Fan‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/149561324@N03/"
                >
                  Marco‌ ‌Verch‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/149561324@N03/42588393305/in/photostream/"
                >
                  Asian‌ ‌Russian‌ ‌Fans‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/149561324@N03/"
                >
                  Marco‌ ‌Verch‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/149561324@N03/43492900801/in/photostream/"
                >
                  Russian‌ ‌Soccer‌ ‌Fans‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/149561324@N03/"
                >
                  Marco‌ ‌Verch‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/thirteenofclubs/5558078210/in/photolist-9t9B1E-rSzaiK-ruwLNg-qRRv8j-rwhLvm-5PfMYM-qS4wCZ-rSwYty-5xQFRW-ryjWm4-5Pk4bE-5Pk4Kd-5a2Mwv-5Pk3Js-xpTv9N-dz5ZuP-KZKDyW-csB4LU-C8mpWq-4YHD7s-5Pk3iC-3bWCG1-4AemKU-bkznik-9KaVfM-EwdSn4-81Ho5c-99dRek-rVCDg-cqhKH-b29v3r-UuqZ6V-7P4uK-fAnaL-FJaayJ-46UyiR-2iitkyg-oP6iu-ERcxkt-Hayfsp-46Uydr-7ogCor-2cwgX1U-iQsmE4-2gCDo8F-8UmVR3-wkNW9A-98pRV1-98mGQr-Pmpv8V"
                >
                  Chemo‌ ‌Mug‌ ‌Shot‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/thirteenofclubs/"
                >
                  Thirteen‌ ‌Of‌ ‌Clubs‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/haru__q/21942137519/"
                >
                  Billboard‌ ‌Array‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/haru__q/"
                >
                  haru__q‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/osd29/8502727791/in/photolist-dXmGK2-7B7ee7-55M9bm-mhWRT-97aM1s-29sWxE-DkSp6i-2iwmXSP-7Rd9jJ-pBc1Nn-tRkpG-oj3gJU-2cRzbC2-8pEGu3-j46VB1-a1MDG8-bKAnU-a8CiMp-519y52-6bRUPc-TrjVyj-astJnq-4RFeK1-7EMHj6-7NaCs-bVVg92-mm4Smt-4TtWM2-KcsePD-Pk3UTw-fgC2Af-Xi2EHs-h81Pd3-9eLUKy-ijehV-gYzem-astJnY-5eEgr7-EnSndv-4W6FoB-L6FvPy-23jxaX5-bV33XP-KpzpPN-dGCDtH-9bjyy3-4d8UU-nbaTJK-hkx8M-bV34C2"
                >
                  Suspicious‌ ‌Old‌ ‌Man‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/osd29/"
                >
                  Olivier‌ ‌LHEMANN‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/poopface/21158159921/"
                >
                  Guy‌ ‌Taking‌ ‌out‌ ‌Trash‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/poopface/"
                >
                  jsnsndr‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/alexxx-malev/46867465392/"
                >
                  Russian‌ ‌Landscape‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/alexxx-malev/"
                >
                  Alexxx‌ ‌Malev‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/105105658@N03/44164387922/"
                >
                  Scrap‌ ‌Heap‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/105105658@N03/"
                >
                  Rob‌ ‌Oo‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/23024164@N06/2708009264/"
                >
                  Cardboard‌ ‌Boxes‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/23024164@N06/"
                >
                  Damian‌ ‌Gadal‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/nicky80/4713018689/in/photolist-8btsfV-2inykxQ-c1ePyE-2inykud-DA1h3q-rw8tSd-dWmJuT-dXmuuC-sbxw57-2inxc34-2inykuD-rwjREi-sbFwv2-2inuFhJ-sqR3GQ-ewzhW-sbyG4q-bLEEAp-sbFB2r-2inykGY-5mpYSV-6x1KPM-2j79u6s-amMx2d-aawR5b-4zTuQJ-gKyezP-9AyTSv-st98E8-fSSnrP-cNYY9m-iKzxGd-eBJ4SM-ki2J1w-9Jpn4D-pCNs-erW88N-dg31F1-dJngps-oKrQW4-55ckZ4-nfZBvs-H6Yte-2inuF73-bkyyDT-9gJZFH-8Wpu1e-8KiWwZ-cNYYi5-2insw7S"
                >
                  Baby‌ ‌Mouth‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/nicky80/"
                >
                  Nicky‌ ‌Eichmann‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/kalexanderson/7832846810/in/photolist-cWaosW-qYnUhb-cryghG-LSZMm-26AEf-4BnSjW-hto4i-2inuF6G-cvDi2s-3QmGGR-oi48-fz52ZC-5Qf54o-arv5KM-5B9MUu-5QgzNG-7X3gwb-67w2fP-w3tTe-4ZgKXU-vCtm9-bgW7TX-auv79p-4aimN4-oC1e-5a116i-21Aeb-9jXrDJ-o6z91-jyTWih-av7Xq-8nsbeC-dWnejz-amsixH-7qcDfp-kbv9gy-52zXD-oBnn-WQ2ku2-7kLRns-rw8p6Q-8VmY1C-aHr64-76oF25-4sQCL9-7QbKbn-semgDp-9sT5tu-rwjRPM-d3KfTy"
                >
                  Man‌ ‌with‌ ‌"W"‌ ‌Mouth‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/kalexanderson/"
                >
                  Kristina‌ ‌Alexanderson‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/eyeliam/2254669791/"
                >
                  Kid‌ ‌on‌ ‌the‌ ‌Phone‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/eyeliam/"
                >
                  Jason‌ ‌Lander‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/jemaleddin/137253873/"
                >
                  Funny‌ ‌Kid‌ ‌Mouth‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/jemaleddin/"
                >
                  Jemaleddin‌ ‌Cole‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/kylemcdonald/7658619496/in/photolist-cELqKJ-apoEvU-auc3oN-bmPabq-bBYYwR-57nNvJ-2hMGtMj-auc3ns-2hrvf55-2goq2Vr-2goq7HN-Ny4HQ7-Curwec-284fgay-2gopNgs-DqvtXw-bnnfQw-Mp16Ah-MEniyd-2hFnkVw-2ibMZhb-BWycoz-NLzQfN-2jq7p3T-EQ7st7-28Vg9XW-2gVgBDF-bsLPz9-jGMx7D-8dHjDU-yLJVMh-92LWbg-qBZbMQ-rk6DhJ-Vu5vPc-5kGiPK-EQ7rZw-EQ7sdN-i66Bdp-29W8Ghm-NSgaXW-hRqutg-2hnCRzD-2gVikgB-CnBefN-pPaQhx-Hw65dm-28hEr6b-FJmXL8-bJsTcF"
                >
                  3D‌ ‌Head‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/kylemcdonald/"
                >
                  Kyle‌ ‌McDonald‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/photographingtravis/31043978041/"
                >
                  Wig‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/photographingtravis/"
                >
                  Travis‌ ‌Wise‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/unit27/42527637592/"
                >
                  Joker‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/unit27/"
                >
                  Unit27‌
                </Anchor>
              </td>
            </tr>

            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/jeffipod/4608176637/"
                >
                  Wild‌ ‌Make‌ ‌Up‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/jeffipod/"
                >
                  Jeff‌ ‌Luyten‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/dashsocean/14320211211/"
                >
                  Jake‌ ‌the‌ ‌Dog‌ ‌Coslay‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/dashsocean/"
                >
                  Dasha‌ ‌Ocean‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/mooshuu/26127789292/"
                >
                  Mooshu‌ ‌Cosplay‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/mooshuu/"
                >
                  Mooshuu‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/ochre_jelly/29881984315/in/photolist-MwyYS8-Lz9Swu-cqa7to-cqa7o7-cqa79s-cqa7sf-cqa7f3-cqa7gY-cqa7j3-cqa7cE-cqa7fS-MpebKV-cqa749-cqa7w3-LzdcpT-MwyW3F-Lz9SDo-LzdbYc-dYBVn8-Lzdc7i-Lz9SxG-Lz9SzA-8brSnc-8VULx1-dzWJB-6dKuFT-9HkNW9-51F5LK-dVgdo6-2moYAD-PDWuo-aGSV74-aoEYXA-aYWBK-68YiFT-jJVv1-7EHD13-8cJzXQ-7QiWyV-7QngGm-jEZo8-jEZo6-jEZo9-pB8TCm-UN1Y8k-7QiXiM-7Qhhq8-6UsXvc-6Mbvjm-472fkQ"
                >
                  Lego‌ ‌Poop‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/ochre_jelly/"
                >
                  Ochre‌ ‌Jelly‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/mooshuu/16876218230/"
                >
                  Weird‌ ‌Cosplay‌ ‌Girl‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.flickr.com/photos/mooshuu/"
                >
                  Mooshuu‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/vectors/star-happy-smiley-emoticon-smilies-153133/"
                >
                  Star‌ ‌Pixabay‌
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://pixabay.com/users/openclipart-vectors-30363/"
                >
                  OpenClipart-Vectors‌
                </Anchor>
              </td>
            </tr>
            <tr>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.youtube.com/watch?v=W6X2B2nIPJw"
                >
                  CACM Feb. 2015 - YFCC100M: The New Data in Multimedia Research
                  HD
                </Anchor>
              </td>
              <td>
                <Anchor
                  target="_blank"
                  href="https://www.youtube.com/user/TheOfficialACM"
                >
                  Association for Computing Machinery (ACM)
                </Anchor>
              </td>
            </tr>
          </tbody>
        </table>
      </Text>
    </>
  );
};
