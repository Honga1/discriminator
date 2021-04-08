import { Box, Button, ResponsiveContext, Text } from "grommet";
import { memo, useCallback, useContext, useRef, useState } from "react";
import styled from "styled-components";
import { CustomScrollbarBox } from "../../../components/CustomScrollbarBox";
import { ButtonCornerMapBox, FullScreenMapBox } from "./MapBox";

type Years = 2015 | 2016 | 2017 | 2019 | 2019;
const validYears = new Set(["2015", "2016", "2017", "2018", "2019"]);

export const Part2Screen3 = () => {
  const isSmall = useContext(ResponsiveContext) === "small";
  const [hideScrollBanner, setHideScrollBanner] = useState(false);

  const [currentYear, setCurrentYear] = useState<Years>(2015);
  const [downloads, setDownloads] = useState(0);
  const scrollBox = useRef<HTMLDivElement>(null);

  const [showFullScreenMap, setShowFullScreenMap] = useState(false);

  const onNavigationClicked = useCallback((year: Years): void => {
    if (!scrollBox.current) return;

    const yearElement = scrollBox.current.querySelector(`.year${year}`) as
      | HTMLDivElement
      | undefined;

    if (!yearElement) return;

    yearElement.scrollIntoView();
    setCurrentYear(year);
  }, []);

  const onScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
    setHideScrollBanner(
      (event.target as HTMLElement).scrollTop !== 0 || hideScrollBanner
    );

    const yearElements = (event.target as HTMLElement).querySelectorAll(
      ".TextRow"
    ) as NodeListOf<HTMLDivElement> | undefined;
    if (!yearElements) return;

    type Entries = ["2015" | "2016" | "2017" | "2018" | "2019", DOMRect];

    const getValidBoundingBoxes = (
      element: HTMLDivElement
    ): Entries | undefined => {
      const maybeYear = element.attributes.getNamedItem("data-year")?.value;
      if (!maybeYear) return undefined;
      if (!validYears.has(maybeYear)) return undefined;

      return [maybeYear, element.getBoundingClientRect()] as Entries;
    };

    const filterInvalid = (value: Entries | undefined): value is Entries =>
      value !== undefined;

    const yearToBoundingBox = Object.fromEntries(
      [...yearElements.values()]
        .map(getValidBoundingBoxes)
        .filter(filterInvalid)
    );

    // Set banner year
    let nextYear: Years = 2015;
    const heightOfOneLine = 72;
    Object.entries(yearToBoundingBox).forEach(([year, { top }]) => {
      if (top >= heightOfOneLine) return;
      const maybeYear = parseInt(year);
      nextYear = Math.max(maybeYear, nextYear) as Years;
    });
    currentYear !== nextYear && setCurrentYear(nextYear);

    // Set banner downloads
    if (isSmall) return;
    const currentYearRect = yearToBoundingBox[nextYear];
    if (!currentYearRect) return;
    const { top, height } = currentYearRect;
    const progress = (-top + heightOfOneLine) / height;
    const dataYearIndex = nextYear - 2015;
    const downloadsBeforeThisYear = data
      .slice(0, dataYearIndex)
      .flatMap(({ entries }) => Array.from({ length: entries.length })).length;
    const estimatedDownloadsUpToScrollPoint = Math.max(
      data[dataYearIndex]!.entries.length * progress,
      0
    );
    const downloads = Math.floor(
      estimatedDownloadsUpToScrollPoint + downloadsBeforeThisYear
    );
    setDownloads(downloads);
  };
  return (
    <Box flex={false} height="100%" width="100%">
      {showFullScreenMap && isSmall && (
        <FullScreenMapBox onClose={() => setShowFullScreenMap(false)} />
      )}
      <Box
        flex={false}
        height="100%"
        width="100%"
        pad="4px"
        hidden={!showFullScreenMap || !isSmall}
        style={{ position: "relative" }}
      >
        <HeaderBar
          isShown={hideScrollBanner}
          downloads={downloads}
          year={currentYear}
          onNavigationClicked={onNavigationClicked}
          onMapClicked={() => setShowFullScreenMap(true)}
        />
        <ScrollBanner isShown={!hideScrollBanner} />
        {!isSmall && <ButtonCornerMapBox isShown={hideScrollBanner} />}
        {isSmall ? (
          <Box
            height="100%"
            width="100%"
            overflow="auto"
            pad={"8px"}
            ref={scrollBox}
            onScroll={onScroll}
          >
            <Data />
          </Box>
        ) : (
          <CustomScrollbarBox
            height="100%"
            width="100%"
            overflow="auto"
            pad={"8px"}
            ref={scrollBox}
            onScroll={onScroll}
          >
            <Data />
          </CustomScrollbarBox>
        )}
      </Box>
    </Box>
  );
};

function TextRow({ year, entries }: { year: number; entries: string[] }) {
  const isSmall = useContext(ResponsiveContext) === "small";

  return (
    <Text className={`TextRow year${year}`} data-year={year}>
      <Text
        weight={"bold"}
        color={"offWhite"}
        size={isSmall ? "20px" : "24px"}
        style={{ lineHeight: isSmall ? "40px" : "72px" }}
      >
        {year}
      </Text>
      &nbsp;&nbsp;
      {entries.map((entry, entryNumber) => {
        return (
          <Text
            color="offWhite"
            size={isSmall ? "20px" : "24px"}
            style={{ lineHeight: isSmall ? "40px" : "72px" }}
            key={entryNumber}
          >
            &nbsp;&nbsp;{entry}
            &nbsp;&nbsp;&nbsp;•••
          </Text>
        );
      })}
      &nbsp;&nbsp;
    </Text>
  );
}

const HeaderBar = ({
  isShown,
  year,
  downloads,
  onNavigationClicked,
  onMapClicked,
}: {
  isShown: boolean;
  year: Years;
  downloads: number;
  onNavigationClicked: (destinationYear: Years) => void;
  onMapClicked: () => void;
}) => {
  const isSmall = useContext(ResponsiveContext) === "small";

  return (
    <SlideInBox
      flex={false}
      width="100%"
      height="48px"
      justify="between"
      isShown={isShown}
      direction="row"
      background="black"
      align="center"
      border={{ side: "bottom", size: "4px", color: "offWhiteOpaque" }}
      pad={{ left: "8px", right: "59px" }}
    >
      <Box flex={false} direction="row" gap="16px" align="center">
        {!isSmall && (
          <Text size="24px" style={{ lineHeight: "24px" }} color="yellow">
            Discriminator
          </Text>
        )}

        <Text
          size="24px"
          style={{ lineHeight: "24px" }}
          color="redLight"
          weight="bold"
        >
          <Button
            style={{
              pointerEvents: "all",
              paddingRight: "10px",
              paddingLeft: isSmall ? "10px" : "0px",
            }}
            onClick={() => {
              const destinationYear = Math.max(2015, year - 1) as Years;
              onNavigationClicked(destinationYear);
            }}
            plain
            label={<ChevronLeft />}
          />
          {year}
          <Button
            style={{
              pointerEvents: "all",
              paddingLeft: "10px",
              paddingRight: isSmall ? "10px" : "0px",
            }}
            onClick={() => {
              const destinationYear = Math.min(2019, year + 1) as Years;
              onNavigationClicked(destinationYear);
            }}
            plain
            label={<ChevronRight />}
          />
        </Text>
        {isSmall && <Button onClick={onMapClicked} label={<MapIcon />} plain />}
      </Box>

      {!isSmall && (
        <Box direction="row" justify="end">
          <Text size="24px" style={{ lineHeight: "24px" }} color="offWhite">
            {downloads} Downloads
          </Text>
        </Box>
      )}
    </SlideInBox>
  );
};

const ScrollBanner = ({ isShown }: { isShown: boolean }) => {
  return (
    <FadeOutBox
      height="145px"
      style={{
        position: "absolute",
        pointerEvents: "none",
        background:
          "linear-gradient(180deg, rgba(32, 33, 34, 0) 0%, #202122 100%)",
        bottom: 0,
        left: 0,
        right: 0,
      }}
      align="center"
      justify="center"
      isShown={isShown}
    >
      <ChevronDown />
    </FadeOutBox>
  );
};

export const FadeOutBox = styled(Box)<{ isShown: boolean }>`
  opacity: ${(props) => (props.isShown ? "1" : "0")};
  transition: opacity 0.2s;
`;

const SlideInBox = styled(Box)<{ isShown: boolean }>`
  overflow: hidden;
  height: ${(props) => (props.isShown ? "48px" : "0px")};
  border-width: ${(props) => (props.isShown ? "4px" : "0px")};
  transition: height 0.2s, border-width 0.2s;
`;

const ChevronDown = () => {
  return (
    <Box width="80px" height="80px" flex={false}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 80 81"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.4739 25.5L15.0005 32.9734L39.912 57.8849L39.9999 57.797L40.0879 57.885L64.9994 32.9735L57.5259 25.5L39.9999 43.026L22.4739 25.5Z"
          fill="#20BF00"
        />
      </svg>
    </Box>
  );
};

const Data = memo(() => {
  return (
    <Text>
      {data.map(({ year, entries }) => {
        return <TextRow key={year} year={year} entries={entries}></TextRow>;
      })}
    </Text>
  );
});

function ChevronLeft() {
  return (
    <svg
      width="13"
      height="20"
      viewBox="0 0 13 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.0106 20L13 17.0106L5.98938 10L13 2.98938L10.0106 -1.3067e-07L0.0460182 9.9646L0.0814233 10L0.046022 10.0354L10.0106 20Z"
        fill="#FF4E4E"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="13"
      height="20"
      viewBox="0 0 13 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.98938 -3.94537e-06L-7.43558e-07 2.98938L7.01062 10L3.36986e-06 17.0106L2.98938 20L12.954 10.0354L12.9186 10L12.954 9.96459L2.98938 -3.94537e-06Z"
        fill="#FF4E4E"
      />
    </svg>
  );
}

function MapIcon() {
  return (
    <Box width="32px" height="32px">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 7L12 9.57143V25L6 22.4286V7Z" fill="#F8F9FA" />
        <path d="M19 7L13 9.57143V25L19 22.4286V7Z" fill="#F8F9FA" />
        <path d="M20 7L26 9.57143V25L20 22.4286V7Z" fill="#F8F9FA" />
      </svg>
    </Box>
  );
}

const data = [
  {
    year: 2015,
    entries: [
      "Megaface launched",
      "The University of Texas at Arlington, United States",
      "Xiamen University, China",
      "European Broadcasting Union, Switzerland",
      "University of Science & Technology Beijing, China",
      " National Chiao Tung Unviersity, Taiwan , Taiwan",
      "Sao Paulo University, Brazil",
      "Hisai Info Technology Co., Ltd., China",
      "University of Parana (UFPR), Brazil",
      "whodat, India",
      "uestc, China",
    ],
  },
  {
    year: 2016,
    entries: [
      "Seoul National University, South Korea",
      "xianweilv, China",
      "Belarusian State University of Informatics and Radioelectronics, Belarus",
      "Home, Turkey",
      "Hanyang University, South Korea",
      "employee, Australia",
      "Feitian Japan, Japan",
      "Northwestern University, United States",
      "Chongqing University of Posts and Telecommunications, China",
      "iiitd, India",
      "Department of Electronic Engineering, Tsinghua University, China",
      "GMTech Inc, Anguilla",
      "American University in Cairo, Egypt",
      "HanKuk University of Foreign Studies, South Korea",
      "Indian Institute of Science(IISc), India",
      "Kaist (Korea Advanced Institute of science and technology), South Korea",
      "Gwangju Institute of Science and Technology, South Korea",
      "University of Colorado, Boulder, United States",
      "RUDN University, Russia",
      "shahid beheshti university, Iran",
      "Moscow institute of physics and technology, Russia",
      "Delft University of Technology, Netherlands",
      "Tianjin University, China",
      "Staqu Technologies, India",
      "Innopolis University, Russian Federation",
      "National Chiao Tung University, Taiwan",
      "Seikei univercity, Japan",
      "Le Ba Tuan Anh, Vietnam",
      "abdalaziz rashid, Russia",
      "CASIA, China",
      "Professor, Brazil",
      "zhejiang university, China",
      "University of Notre Dame, United States",
      "Yokohama National University, Japan",
      "XIX.ai, Anguilla",
      "Institute of Control Science of RAS, Russia",
      "Southeast University, China",
      "University of Science and Technology of China, China",
      "personal project, Taiwan",
      "Norwegian University of Science and Technology, Norway",
      "Nanjing University, China",
      "National Taiwan University, Taiwan",
      "Dalton, Indonesia",
      "Stanford University, United States",
      "KanazawaGakuinUniversity, Japan",
      "Individual, Japan",
      "South China University of Technology(SCUT), China",
      "Ho Chi Minh University of Technology, Viet Nam",
      "By Techdesign, Spain",
      "Tongji University, China",
      "Computer Science Institute, China",
      "EORA Data Lab, Russia",
      "ÉTS, Canada",
      "jiang shan, China",
      "Xidian, China",
      "Anyvision, Colombia",
      "URFU, Russia",
      "Belgorod state university, Belgorod, Russia, Russia",
      "Development Team, British Indian Ocean Territory",
      "NSU, Russia",
      "McMaster University, Canada",
      "Beijing University of Chemical Technology, China",
      "beijing institute of technology, China",
      "EE, South Korea",
      "Amirkabir University of Technology, Iran, Islamic Republic of",
      "Michigan State University, United States",
      "Microsoft, United States",
      "Rokid R-Lab, Anguilla",
      "National University of Singapore, Singapore",
      "Dalian University of Technology, China",
      "School of Computer Science, Wuhan University, China, China",
      "Chulalongkorn University, Thailand",
      "Northwestern Polytechnical University, China",
      "NLPR, CASIA, China",
      "Wongyufei, China",
      "Politehnica University of Bucharest, Romania",
      "Sun Yat-sen University, China",
      "University of Minnesota - Twin Cities, United States",
      "national chung cheng university, Taiwan",
      "Ubiquitous Laboratory, Japan",
      "INA, Saint Martin",
      "Universiti Malaysia Sabah, Jalan UMS, 88400, Kota Kinabalu, Sabah, Malaysia, China",
      "Jason, Australia",
      "Xi'an University of Posts and Telecommunications, China",
      "INRIA, France",
      "University of Waterloo, Canada",
      "TripleIze, Japan",
      "CDAC India, India",
      "Facebook, United States",
      "AI Team, Japan",
      "Facultad de Ingeniería, Universidad de la República, Uruguay, Uruguay",
      "University, Russia",
      "Intel, United States",
      "Researchers, South Africa",
      "National Chiao Tung University, Taiwan",
      "Universiti Sains Malaysia, Malaysia",
      "Sri Sathya Sai Insitiute of Higher Learning, India",
      "Southern Alberta Institute of Technology, Canada",
      "University of Leon, Spain",
      "Virginia Tech, United States",
      "Tsinghua University, China",
      "University of Electronic Science and Technology of China, China",
      "VinAI Research, British Indian Ocean Territory",
      "ftech.ai, Anguilla",
      "University of Western Ontario, Canada",
      "Centre for Development of Advanced Computing, India",
      "Galacrity, Anguilla",
      "Tecnologico de Monterrey, Mexico",
      "ANNA UNIVERSITY, India",
      "Hochschule Darmstadt, Germany",
      "ByteCorp, British Indian Ocean Territory",
      "Teacher, China",
      "Samara Univercity, Russia",
      "yonsei university, South Korea",
      "Zhejiang University, China",
      "taiwan, Taiwan",
      "Soochow University, China",
      "deep-percept, Japan",
      "Personal use, Belgium",
      "KAIST, South Korea",
      "Florida Atlantic University, United States",
      "Kookmin University, South Korea",
      "法政大学大学院, Japan",
      "National University of Science and Technology, Pakistan",
      "Samsung Electronics, Canada",
      "PES University, India",
      "Nanjing university, China",
      "Akdeniz University, Turkey",
      "NRNU MEPhI, Russia",
      "None, Belarus",
      "King Mongkut's Institute of Technology Ladkrabang, Thailand",
      "University of Michigan, United States",
      "University of Melbourne, Australia",
      "Jiwei Xu, China",
      "University of Minnesota, United States",
      "Intelbras, Brazil",
      "cnu, China",
      "Employee, Japan",
      "Griffith University, Australia",
      "National Taiwan University of Science and Technology, Taiwan",
      "Nation Taiwan University, Taiwan",
      "National Chiao Tung University, Taiwan, Taiwan",
      "ISEN, Saint Martin",
      "Academic research (master thesis), Italy",
      "jimzheng@hku.hk, Hong Kong",
      "National Cheng Kung University, Taiwan",
      "Perm State University, Russia",
      "sdudent, China",
      "new, Spain",
      "University of Campinas, Brazil",
      "phd, South Korea",
      "DST Group, Edinburgh, Australia., Australia",
      "University of Chinese Academy of Sciences, China",
      "Clarkson University, United States",
      "Faculty of electrical engineering and computing, University of Zagreb, Croatia",
      "NOTA, Anguilla",
      "Ircam, Saint Martin",
      "University of Liverpool, United Kingdom",
      "Electronics and Telecommunications Research Institute, South Korea",
      "Dr. Suharjito, S.Si., MT, Binus University, Indonesia",
      "Inha University, South Korea",
      "University of Belgrade, Serbia",
      "UniFOA (Volta Redonda University Center), Brazil",
      "FPT Corporation, Vietnam",
      "Researcher, Italy",
      "LG Electronics, South Korea",
      "VESA, Vietnam",
      "日本大学, Japan",
      "University of Iowa, United States",
      "Qihoo 360 Technology Co. Ltd., China",
      "Image processing, China",
      "Shandong University, China, China",
      "Shanghai Clever mRobot Technologies Co.,Ltd, China",
      "hikvision, China",
      "Tsinghua University of China, China",
      "China University of Mining and Technology, Beijing, China",
      "CAD&CG State key Laboratory of China, China",
      "alibaba inc, China",
      "sichuan university, China",
      "Southwest University of Science and Technology, China",
      "NUAA, China",
      "Alibaba Group, China",
      "University Of Electronic Science And Technology Of China, China",
      "chinese academy of science, China",
      "College of computer, National University of Defense Technology, China",
      "wuhan university, China",
      "Central South University in China, China",
      "Tsinghua, China",
      "Sun yat-sen university, China",
      "China NanJing university of scientist and technology, China",
      "Guangdong University of Technology, Guangzhou, China, China",
      "Canon Information Technology (Beijing) Co., Ltd., China",
      "shenzhen university, China",
      "national university of defense technology, China",
      "Ping An Technology, China",
      "shang hai university, China",
      "the Second Institute of China Aerospace Science and Technology Corporation, China",
      "North China University of Water Resources and Electric Power, China",
      "baidu, China",
      "ShenZhen university, China",
      "university of science and technology of beijing,china, China",
      "BitEye Inc., China",
      "BUPT, China, China",
      "school of computer science and technology ShanDong University,China, China",
      "liaoning university, China",
      "Huawei, China",
      "liaocheng university, CHN",
      "Shanghai Institute of Technical Physics, Chinese Academy of Sciences, China",
      "south china university of techonology, China",
      "PingAn Life Insurance of China, China",
      "Adobe Research, United States",
      "Affectiva, United States",
      "affectiva, United States",
      "SHENZHEN UNIVERSITY, China",
      "Alibaba Cloud, China",
      "Alibaba Robot Company, China",
      "iDST, Alibaba, China",
      "Alibaba, University of Washington, China",
      "Alibaba Inc., China",
      "alibaba, China",
      "Align Technology, Inc., China",
      "Independent researcher, United States",
      "Baidu company, China",
      "Bitmain, China",
      "ByteDance, China",
      "China 's Chengdu City, Sichuan Province XinZhouRuiShi Technology Co; http://www.cdxzrs.com/ , China",
      "China Electronics Technology Group Corporation, China",
      "Cisco, United States",
      "Cisco Systems, United States",
      "Central Michigan University, United States",
      "Cognitec Systems GmbH, Germany",
      "Harvard College, United States",
      "columbia univeristy, United States",
      "columbia, United States",
      "Columbia, United States",
      "CMU, United States",
      "facial recognition researcher, United States",
      "UMass Amherst, United States",
      "UMass, United States",
      "UT Austin, United States",
      "UW, United States",
      "TEST, United States",
      "Industry/DoD, United States",
      "Graduate Research Assistant, United States",
      "R & D, United States",
      "DeepGlint, Beijing, China, China",
      "Government, United States",
      "Duke University Graduate Student, United States",
      "United States Army Research Laboratory (ARL), United States",
      "ARL, United States",
      "uta, United States",
      "UT Arlington, United States",
      "Megvii Inc, China",
      "Megvii Inc., China",
      "+86 15255105537, United States",
      "+86 13262898762, United States",
      "Microsoft Bing Multimedia Team, United States",
      "microsoft, United States",
      "Undergraduate Researcher, United States",
      "Massachusetts Institute of Technology, United States",
      "Research Assistant, United States",
      "WVU, United States",
      "Morpx, Inc, Hangzhou, China, 310000, China",
      "Naver Inc., South Korea",
      "NAVER CLOVA AI RESEARCH, South Korea",
      "naver, South Korea",
      "Naver corp., South Korea",
      "BCSU, United States",
      "Dept. of Electrical and Computer Engineering, United States",
      "civil engineering, United States",
      "north carolina state university, United States",
      "NEC laboratories America, Inc, United States",
      "Neurotechnology, Lithuania",
      "General Manager, Turkey",
      "Noblis, United States",
      "Noblis Corporation, United States",
      "The New York Times, United States",
      "New York University / Tisch School of Arts, United States",
      "NYU Shanghai, United States",
      "NYU, United States",
      "ECE at Ohio State University, United States",
      "Computer Vision, Taiwan",
      "Mobile Communication Product Develop Center, Taiwan",
      "Philips Research North America, United States",
      "Moscow Institute of Physics and Technology (State University), Russia",
      "Moscow Institute of Physics and Technology, Russia",
      "Evgeny Sokolov, PhD researcher at Moscow Institute of Physics and Technologies, Russia",
      "MIPT, Russia",
      "Image recognition and text processing group at Deparment of Innovations and High technology (DIHT), Moscow institute of physics and technology (MIPT), Russia",
      "Ecole polytechnique, France",
      "Ecole Polytechnique, France",
      "Penn State, United States",
      "Penn State University, United States",
      "Hangzhou 9ji Technology Co., Ltd., China",
      "Tencent Holdings Ltd, China",
      "university of science & technology beijing, China",
      "SenseTime.Inc, China",
      "south china university of technology, China",
      "software engineering,NUAA in nanjing ,China, China",
      "Huaiyin Institute Of Technology, China",
      "wuyi university, China",
      "xiamen university of china, China",
      "Shenzhen Zhongchao XinDa Financial Technologies Ltd, China",
      "Key Laboratory of Intelligent Computation & Signal Processing, Ministry of Education, Anhui University, Hefei, China, China",
      "HUBEI UNIVERSITY, China",
      "Southeast University, China, China",
      "Shenzhen university, China",
      "Wuhan University, China",
      "Yanshan University In China, China",
      "alibaba, China",
      "SenseTime Group Limited, China",
      "sensetime, China",
      "Sensetime, China",
      "lixiaojie@sensetime.com, China",
      "UMASS LOWELL, United States",
      "Computer Science, Texas A&M, United States",
      "Tencent Beijing Office, China",
      "youtu.sng.tencent, China",
      "Tencent YouTu Lab, China",
      "shanghai,China, China",
      "Platform RD Group 2, China",
      "YouTu Lab, Tencent, China",
      "tencent, China",
      "university of maryland, college park, United States",
      "University of Mia, United States",
      "UMICH, United States",
      "University of Rhode Island @ Computer Science and Statistics, United States",
      "IBM Research, United States",
      "Panasonic, United States",
      "The University of Texas at Dallas, United States",
      "University of Toledo, United States",
      "The university of tennessee, knxoville, United States",
      "no affiliation, personal project, United State",
    ],
  },
  {
    year: 2017,
    entries: [
      "Seoul National University, South Korea",
      "xianweilv, China",
      "Belarusian State University of Informatics and Radioelectronics, Belarus",
      "Home, Turkey",
      "Hanyang University, South Korea",
      "employee, Australia",
      "Feitian Japan, Japan",
      "Northwestern University, United States",
      "Chongqing University of Posts and Telecommunications, China",
      "iiitd, India",
      "Department of Electronic Engineering, Tsinghua University, China",
      "GMTech Inc, Anguilla",
      "American University in Cairo, Egypt",
      "HanKuk University of Foreign Studies, South Korea",
      "Indian Institute of Science(IISc), India",
      "Kaist (Korea Advanced Institute of science and technology), South Korea",
      "Gwangju Institute of Science and Technology, South Korea",
      "University of Colorado, Boulder, United States",
      "RUDN University, Russia",
      "shahid beheshti university, Iran",
      "Moscow institute of physics and technology, Russia",
      "Delft University of Technology, Netherlands",
      "Tianjin University, China",
      "Staqu Technologies, India",
      "Innopolis University, Russian Federation",
      "National Chiao Tung University, Taiwan",
      "Seikei univercity, Japan",
      "Le Ba Tuan Anh, Vietnam",
      "abdalaziz rashid, Russia",
      "CASIA, China",
      "Professor, Brazil",
      "zhejiang university, China",
      "University of Notre Dame, United States",
      "Yokohama National University, Japan",
      "XIX.ai, Anguilla",
      "Institute of Control Science of RAS, Russia",
      "Southeast University, China",
      "University of Science and Technology of China, China",
      "personal project, Taiwan",
      "Norwegian University of Science and Technology, Norway",
      "Nanjing University, China",
      "National Taiwan University, Taiwan",
      "Dalton, Indonesia",
      "Stanford University, United States",
      "KanazawaGakuinUniversity, Japan",
      "Individual, Japan",
      "South China University of Technology(SCUT), China",
      "Ho Chi Minh University of Technology, Viet Nam",
      "By Techdesign, Spain",
      "Tongji University, China",
      "Computer Science Institute, China",
      "EORA Data Lab, Russia",
      "ÉTS, Canada",
      "jiang shan, China",
      "Xidian, China",
      "Anyvision, Colombia",
      "URFU, Russia",
      "Belgorod state university, Belgorod, Russia, Russia",
      "Development Team, British Indian Ocean Territory",
      "NSU, Russia",
      "McMaster University, Canada",
      "Beijing University of Chemical Technology, China",
      "beijing institute of technology, China",
      "EE, South Korea",
      "Amirkabir University of Technology, Iran, Islamic Republic of",
      "Michigan State University, United States",
      "Microsoft, United States",
      "Rokid R-Lab, Anguilla",
      "National University of Singapore, Singapore",
      "Dalian University of Technology, China",
      "School of Computer Science, Wuhan University, China, China",
      "Chulalongkorn University, Thailand",
      "Northwestern Polytechnical University, China",
      "NLPR, CASIA, China",
      "Wongyufei, China",
      "Politehnica University of Bucharest, Romania",
      "Sun Yat-sen University, China",
      "University of Minnesota - Twin Cities, United States",
      "national chung cheng university, Taiwan",
      "Ubiquitous Laboratory, Japan",
      "INA, Saint Martin",
      "Universiti Malaysia Sabah, Jalan UMS, 88400, Kota Kinabalu, Sabah, Malaysia, China",
      "Jason, Australia",
      "Xi'an University of Posts and Telecommunications, China",
      "INRIA, France",
      "University of Waterloo, Canada",
      "TripleIze, Japan",
      "CDAC India, India",
      "Facebook, United States",
      "AI Team, Japan",
      "Facultad de Ingeniería, Universidad de la República, Uruguay, Uruguay",
      "University, Russia",
      "Intel, United States",
      "Researchers, South Africa",
      "National Chiao Tung University, Taiwan",
      "Universiti Sains Malaysia, Malaysia",
      "Sri Sathya Sai Insitiute of Higher Learning, India",
      "Southern Alberta Institute of Technology, Canada",
      "University of Leon, Spain",
      "Virginia Tech, United States",
      "Tsinghua University, China",
      "University of Electronic Science and Technology of China, China",
      "VinAI Research, British Indian Ocean Territory",
      "ftech.ai, Anguilla",
      "University of Western Ontario, Canada",
      "Centre for Development of Advanced Computing, India",
      "Galacrity, Anguilla",
      "Tecnologico de Monterrey, Mexico",
      "ANNA UNIVERSITY, India",
      "Hochschule Darmstadt, Germany",
      "ByteCorp, British Indian Ocean Territory",
      "Teacher, China",
      "Samara Univercity, Russia",
      "yonsei university, South Korea",
      "Zhejiang University, China",
      "taiwan, Taiwan",
      "Soochow University, China",
      "deep-percept, Japan",
      "Personal use, Belgium",
      "KAIST, South Korea",
      "Florida Atlantic University, United States",
      "Kookmin University, South Korea",
      "法政大学大学院, Japan",
      "National University of Science and Technology, Pakistan",
      "Samsung Electronics, Canada",
      "PES University, India",
      "Nanjing university, China",
      "Akdeniz University, Turkey",
      "NRNU MEPhI, Russia",
      "None, Belarus",
      "King Mongkut's Institute of Technology Ladkrabang, Thailand",
      "University of Michigan, United States",
      "University of Melbourne, Australia",
      "Jiwei Xu, China",
      "University of Minnesota, United States",
      "Intelbras, Brazil",
      "cnu, China",
      "Employee, Japan",
      "Griffith University, Australia",
      "National Taiwan University of Science and Technology, Taiwan",
      "Nation Taiwan University, Taiwan",
      "National Chiao Tung University, Taiwan, Taiwan",
      "ISEN, Saint Martin",
      "Academic research (master thesis), Italy",
      "jimzheng@hku.hk, Hong Kong",
      "National Cheng Kung University, Taiwan",
      "Perm State University, Russia",
      "sdudent, China",
      "new, Spain",
      "University of Campinas, Brazil",
      "phd, South Korea",
      "DST Group, Edinburgh, Australia., Australia",
      "University of Chinese Academy of Sciences, China",
      "Clarkson University, United States",
      "Faculty of electrical engineering and computing, University of Zagreb, Croatia",
      "NOTA, Anguilla",
      "Ircam, Saint Martin",
      "University of Liverpool, United Kingdom",
      "Electronics and Telecommunications Research Institute, South Korea",
      "Dr. Suharjito, S.Si., MT, Binus University, Indonesia",
      "Inha University, South Korea",
      "University of Belgrade, Serbia",
      "UniFOA (Volta Redonda University Center), Brazil",
      "FPT Corporation, Vietnam",
      "Researcher, Italy",
      "LG Electronics, South Korea",
      "VESA, Vietnam",
      "日本大学, Japan",
      "University of Iowa, United States",
      "Qihoo 360 Technology Co. Ltd., China",
      "Image processing, China",
      "Shandong University, China, China",
      "Shanghai Clever mRobot Technologies Co.,Ltd, China",
      "hikvision, China",
      "Tsinghua University of China, China",
      "China University of Mining and Technology, Beijing, China",
      "CAD&CG State key Laboratory of China, China",
      "alibaba inc, China",
      "sichuan university, China",
      "Southwest University of Science and Technology, China",
      "NUAA, China",
      "Alibaba Group, China",
      "University Of Electronic Science And Technology Of China, China",
      "chinese academy of science, China",
      "College of computer, National University of Defense Technology, China",
      "wuhan university, China",
      "Central South University in China, China",
      "Tsinghua, China",
      "Sun yat-sen university, China",
      "China NanJing university of scientist and technology, China",
      "Guangdong University of Technology, Guangzhou, China, China",
      "Canon Information Technology (Beijing) Co., Ltd., China",
      "shenzhen university, China",
      "national university of defense technology, China",
      "Ping An Technology, China",
      "shang hai university, China",
      "the Second Institute of China Aerospace Science and Technology Corporation, China",
      "North China University of Water Resources and Electric Power, China",
      "baidu, China",
      "ShenZhen university, China",
      "university of science and technology of beijing,china, China",
      "BitEye Inc., China",
      "BUPT, China, China",
      "school of computer science and technology ShanDong University,China, China",
      "liaoning university, China",
      "Huawei, China",
      "liaocheng university, CHN",
      "Shanghai Institute of Technical Physics, Chinese Academy of Sciences, China",
      "south china university of techonology, China",
      "PingAn Life Insurance of China, China",
      "Adobe Research, United States",
      "Affectiva, United States",
      "affectiva, United States",
      "SHENZHEN UNIVERSITY, China",
      "Alibaba Cloud, China",
      "Alibaba Robot Company, China",
      "iDST, Alibaba, China",
      "Alibaba, University of Washington, China",
      "Alibaba Inc., China",
      "alibaba, China",
      "Align Technology, Inc., China",
      "Independent researcher, United States",
      "Baidu company, China",
      "Bitmain, China",
      "ByteDance, China",
      "China 's Chengdu City, Sichuan Province XinZhouRuiShi Technology Co; http://www.cdxzrs.com/ , China",
      "China Electronics Technology Group Corporation, China",
      "Cisco, United States",
      "Cisco Systems, United States",
      "Central Michigan University, United States",
      "Cognitec Systems GmbH, Germany",
      "Harvard College, United States",
      "columbia univeristy, United States",
      "columbia, United States",
      "Columbia, United States",
      "CMU, United States",
      "facial recognition researcher, United States",
      "UMass Amherst, United States",
      "UMass, United States",
      "UT Austin, United States",
      "UW, United States",
      "TEST, United States",
      "Industry/DoD, United States",
      "Graduate Research Assistant, United States",
      "R & D, United States",
      "DeepGlint, Beijing, China, China",
      "Government, United States",
      "Duke University Graduate Student, United States",
      "United States Army Research Laboratory (ARL), United States",
      "ARL, United States",
      "uta, United States",
      "UT Arlington, United States",
      "Megvii Inc, China",
      "Megvii Inc., China",
      "+86 15255105537, United States",
      "+86 13262898762, United States",
      "Microsoft Bing Multimedia Team, United States",
      "microsoft, United States",
      "Undergraduate Researcher, United States",
      "Massachusetts Institute of Technology, United States",
      "Research Assistant, United States",
      "WVU, United States",
      "Morpx, Inc, Hangzhou, China, 310000, China",
      "Naver Inc., South Korea",
      "NAVER CLOVA AI RESEARCH, South Korea",
      "naver, South Korea",
      "Naver corp., South Korea",
      "BCSU, United States",
      "Dept. of Electrical and Computer Engineering, United States",
      "civil engineering, United States",
      "north carolina state university, United States",
      "NEC laboratories America, Inc, United States",
      "Neurotechnology, Lithuania",
      "General Manager, Turkey",
      "Noblis, United States",
      "Noblis Corporation, United States",
      "The New York Times, United States",
      "New York University / Tisch School of Arts, United States",
      "NYU Shanghai, United States",
      "NYU, United States",
      "ECE at Ohio State University, United States",
      "Computer Vision, Taiwan",
      "Mobile Communication Product Develop Center, Taiwan",
      "Philips Research North America, United States",
      "Moscow Institute of Physics and Technology (State University), Russia",
      "Moscow Institute of Physics and Technology, Russia",
      "Evgeny Sokolov, PhD researcher at Moscow Institute of Physics and Technologies, Russia",
      "MIPT, Russia",
      "Image recognition and text processing group at Deparment of Innovations and High technology (DIHT), Moscow institute of physics and technology (MIPT), Russia",
      "Ecole polytechnique, France",
      "Ecole Polytechnique, France",
      "Penn State, United States",
      "Penn State University, United States",
      "Hangzhou 9ji Technology Co., Ltd., China",
      "Tencent Holdings Ltd, China",
      "university of science & technology beijing, China",
      "SenseTime.Inc, China",
      "south china university of technology, China",
      "software engineering,NUAA in nanjing ,China, China",
      "Huaiyin Institute Of Technology, China",
      "wuyi university, China",
      "xiamen university of china, China",
      "Shenzhen Zhongchao XinDa Financial Technologies Ltd, China",
      "Key Laboratory of Intelligent Computation & Signal Processing, Ministry of Education, Anhui University, Hefei, China, China",
      "HUBEI UNIVERSITY, China",
      "Southeast University, China, China",
      "Shenzhen university, China",
      "Wuhan University, China",
      "Yanshan University In China, China",
      "alibaba, China",
      "SenseTime Group Limited, China",
      "sensetime, China",
      "Sensetime, China",
      "lixiaojie@sensetime.com, China",
      "UMASS LOWELL, United States",
      "Computer Science, Texas A&M, United States",
      "Tencent Beijing Office, China",
      "youtu.sng.tencent, China",
      "Tencent YouTu Lab, China",
      "shanghai,China, China",
      "Platform RD Group 2, China",
      "YouTu Lab, Tencent, China",
      "tencent, China",
      "university of maryland, college park, United States",
      "University of Mia, United States",
      "UMICH, United States",
      "University of Rhode Island @ Computer Science and Statistics, United States",
      "IBM Research, United States",
      "Panasonic, United States",
      "The University of Texas at Dallas, United States",
      "University of Toledo, United States",
      "The university of tennessee, knxoville, United States",
      "no affiliation, personal project, United State",
    ],
  },
  {
    year: 2018,
    entries: [
      "Seoul National University, South Korea",
      "xianweilv, China",
      "Belarusian State University of Informatics and Radioelectronics, Belarus",
      "Home, Turkey",
      "Hanyang University, South Korea",
      "employee, Australia",
      "Feitian Japan, Japan",
      "Northwestern University, United States",
      "Chongqing University of Posts and Telecommunications, China",
      "iiitd, India",
      "Department of Electronic Engineering, Tsinghua University, China",
      "GMTech Inc, Anguilla",
      "American University in Cairo, Egypt",
      "HanKuk University of Foreign Studies, South Korea",
      "Indian Institute of Science(IISc), India",
      "Kaist (Korea Advanced Institute of science and technology), South Korea",
      "Gwangju Institute of Science and Technology, South Korea",
      "University of Colorado, Boulder, United States",
      "RUDN University, Russia",
      "shahid beheshti university, Iran",
      "Moscow institute of physics and technology, Russia",
      "Delft University of Technology, Netherlands",
      "Tianjin University, China",
      "Staqu Technologies, India",
      "Innopolis University, Russian Federation",
      "National Chiao Tung University, Taiwan",
      "Seikei univercity, Japan",
      "Le Ba Tuan Anh, Vietnam",
      "abdalaziz rashid, Russia",
      "CASIA, China",
      "Professor, Brazil",
      "zhejiang university, China",
      "University of Notre Dame, United States",
      "Yokohama National University, Japan",
      "XIX.ai, Anguilla",
      "Institute of Control Science of RAS, Russia",
      "Southeast University, China",
      "University of Science and Technology of China, China",
      "personal project, Taiwan",
      "Norwegian University of Science and Technology, Norway",
      "Nanjing University, China",
      "National Taiwan University, Taiwan",
      "Dalton, Indonesia",
      "Stanford University, United States",
      "KanazawaGakuinUniversity, Japan",
      "Individual, Japan",
      "South China University of Technology(SCUT), China",
      "Ho Chi Minh University of Technology, Viet Nam",
      "By Techdesign, Spain",
      "Tongji University, China",
      "Computer Science Institute, China",
      "EORA Data Lab, Russia",
      "ÉTS, Canada",
      "jiang shan, China",
      "Xidian, China",
      "Anyvision, Colombia",
      "URFU, Russia",
      "Belgorod state university, Belgorod, Russia, Russia",
      "Development Team, British Indian Ocean Territory",
      "NSU, Russia",
      "McMaster University, Canada",
      "Beijing University of Chemical Technology, China",
      "beijing institute of technology, China",
      "EE, South Korea",
      "Amirkabir University of Technology, Iran, Islamic Republic of",
      "Michigan State University, United States",
      "Microsoft, United States",
      "Rokid R-Lab, Anguilla",
      "National University of Singapore, Singapore",
      "Dalian University of Technology, China",
      "School of Computer Science, Wuhan University, China, China",
      "Chulalongkorn University, Thailand",
      "Northwestern Polytechnical University, China",
      "NLPR, CASIA, China",
      "Wongyufei, China",
      "Politehnica University of Bucharest, Romania",
      "Sun Yat-sen University, China",
      "University of Minnesota - Twin Cities, United States",
      "national chung cheng university, Taiwan",
      "Ubiquitous Laboratory, Japan",
      "INA, Saint Martin",
      "Universiti Malaysia Sabah, Jalan UMS, 88400, Kota Kinabalu, Sabah, Malaysia, China",
      "Jason, Australia",
      "Xi'an University of Posts and Telecommunications, China",
      "INRIA, France",
      "University of Waterloo, Canada",
      "TripleIze, Japan",
      "CDAC India, India",
      "Facebook, United States",
      "AI Team, Japan",
      "Facultad de Ingeniería, Universidad de la República, Uruguay, Uruguay",
      "University, Russia",
      "Intel, United States",
      "Researchers, South Africa",
      "National Chiao Tung University, Taiwan",
      "Universiti Sains Malaysia, Malaysia",
      "Sri Sathya Sai Insitiute of Higher Learning, India",
      "Southern Alberta Institute of Technology, Canada",
      "University of Leon, Spain",
      "Virginia Tech, United States",
      "Tsinghua University, China",
      "University of Electronic Science and Technology of China, China",
      "VinAI Research, British Indian Ocean Territory",
      "ftech.ai, Anguilla",
      "University of Western Ontario, Canada",
      "Centre for Development of Advanced Computing, India",
      "Galacrity, Anguilla",
      "Tecnologico de Monterrey, Mexico",
      "ANNA UNIVERSITY, India",
      "Hochschule Darmstadt, Germany",
      "ByteCorp, British Indian Ocean Territory",
      "Teacher, China",
      "Samara Univercity, Russia",
      "yonsei university, South Korea",
      "Zhejiang University, China",
      "taiwan, Taiwan",
      "Soochow University, China",
      "deep-percept, Japan",
      "Personal use, Belgium",
      "KAIST, South Korea",
      "Florida Atlantic University, United States",
      "Kookmin University, South Korea",
      "法政大学大学院, Japan",
      "National University of Science and Technology, Pakistan",
      "Samsung Electronics, Canada",
      "PES University, India",
      "Nanjing university, China",
      "Akdeniz University, Turkey",
      "NRNU MEPhI, Russia",
      "None, Belarus",
      "King Mongkut's Institute of Technology Ladkrabang, Thailand",
      "University of Michigan, United States",
      "University of Melbourne, Australia",
      "Jiwei Xu, China",
      "University of Minnesota, United States",
      "Intelbras, Brazil",
      "cnu, China",
      "Employee, Japan",
      "Griffith University, Australia",
      "National Taiwan University of Science and Technology, Taiwan",
      "Nation Taiwan University, Taiwan",
      "National Chiao Tung University, Taiwan, Taiwan",
      "ISEN, Saint Martin",
      "Academic research (master thesis), Italy",
      "jimzheng@hku.hk, Hong Kong",
      "National Cheng Kung University, Taiwan",
      "Perm State University, Russia",
      "sdudent, China",
      "new, Spain",
      "University of Campinas, Brazil",
      "phd, South Korea",
      "DST Group, Edinburgh, Australia., Australia",
      "University of Chinese Academy of Sciences, China",
      "Clarkson University, United States",
      "Faculty of electrical engineering and computing, University of Zagreb, Croatia",
      "NOTA, Anguilla",
      "Ircam, Saint Martin",
      "University of Liverpool, United Kingdom",
      "Electronics and Telecommunications Research Institute, South Korea",
      "Dr. Suharjito, S.Si., MT, Binus University, Indonesia",
      "Inha University, South Korea",
      "University of Belgrade, Serbia",
      "UniFOA (Volta Redonda University Center), Brazil",
      "FPT Corporation, Vietnam",
      "Researcher, Italy",
      "LG Electronics, South Korea",
      "VESA, Vietnam",
      "日本大学, Japan",
      "University of Iowa, United States",
      "Qihoo 360 Technology Co. Ltd., China",
      "Image processing, China",
      "Shandong University, China, China",
      "Shanghai Clever mRobot Technologies Co.,Ltd, China",
      "hikvision, China",
      "Tsinghua University of China, China",
      "China University of Mining and Technology, Beijing, China",
      "CAD&CG State key Laboratory of China, China",
      "alibaba inc, China",
      "sichuan university, China",
      "Southwest University of Science and Technology, China",
      "NUAA, China",
      "Alibaba Group, China",
      "University Of Electronic Science And Technology Of China, China",
      "chinese academy of science, China",
      "College of computer, National University of Defense Technology, China",
      "wuhan university, China",
      "Central South University in China, China",
      "Tsinghua, China",
      "Sun yat-sen university, China",
      "China NanJing university of scientist and technology, China",
      "Guangdong University of Technology, Guangzhou, China, China",
      "Canon Information Technology (Beijing) Co., Ltd., China",
      "shenzhen university, China",
      "national university of defense technology, China",
      "Ping An Technology, China",
      "shang hai university, China",
      "the Second Institute of China Aerospace Science and Technology Corporation, China",
      "North China University of Water Resources and Electric Power, China",
      "baidu, China",
      "ShenZhen university, China",
      "university of science and technology of beijing,china, China",
      "BitEye Inc., China",
      "BUPT, China, China",
      "school of computer science and technology ShanDong University,China, China",
      "liaoning university, China",
      "Huawei, China",
      "liaocheng university, CHN",
      "Shanghai Institute of Technical Physics, Chinese Academy of Sciences, China",
      "south china university of techonology, China",
      "PingAn Life Insurance of China, China",
      "Adobe Research, United States",
      "Affectiva, United States",
      "affectiva, United States",
      "SHENZHEN UNIVERSITY, China",
      "Alibaba Cloud, China",
      "Alibaba Robot Company, China",
      "iDST, Alibaba, China",
      "Alibaba, University of Washington, China",
      "Alibaba Inc., China",
      "alibaba, China",
      "Align Technology, Inc., China",
      "Independent researcher, United States",
      "Baidu company, China",
      "Bitmain, China",
      "ByteDance, China",
      "China 's Chengdu City, Sichuan Province XinZhouRuiShi Technology Co; http://www.cdxzrs.com/ , China",
      "China Electronics Technology Group Corporation, China",
      "Cisco, United States",
      "Cisco Systems, United States",
      "Central Michigan University, United States",
      "Cognitec Systems GmbH, Germany",
      "Harvard College, United States",
      "columbia univeristy, United States",
      "columbia, United States",
      "Columbia, United States",
      "CMU, United States",
      "facial recognition researcher, United States",
      "UMass Amherst, United States",
      "UMass, United States",
      "UT Austin, United States",
      "UW, United States",
      "TEST, United States",
      "Industry/DoD, United States",
      "Graduate Research Assistant, United States",
      "R & D, United States",
      "DeepGlint, Beijing, China, China",
      "Government, United States",
      "Duke University Graduate Student, United States",
      "United States Army Research Laboratory (ARL), United States",
      "ARL, United States",
      "uta, United States",
      "UT Arlington, United States",
      "Megvii Inc, China",
      "Megvii Inc., China",
      "+86 15255105537, United States",
      "+86 13262898762, United States",
      "Microsoft Bing Multimedia Team, United States",
      "microsoft, United States",
      "Undergraduate Researcher, United States",
      "Massachusetts Institute of Technology, United States",
      "Research Assistant, United States",
      "WVU, United States",
      "Morpx, Inc, Hangzhou, China, 310000, China",
      "Naver Inc., South Korea",
      "NAVER CLOVA AI RESEARCH, South Korea",
      "naver, South Korea",
      "Naver corp., South Korea",
      "BCSU, United States",
      "Dept. of Electrical and Computer Engineering, United States",
      "civil engineering, United States",
      "north carolina state university, United States",
      "NEC laboratories America, Inc, United States",
      "Neurotechnology, Lithuania",
      "General Manager, Turkey",
      "Noblis, United States",
      "Noblis Corporation, United States",
      "The New York Times, United States",
      "New York University / Tisch School of Arts, United States",
      "NYU Shanghai, United States",
      "NYU, United States",
      "ECE at Ohio State University, United States",
      "Computer Vision, Taiwan",
      "Mobile Communication Product Develop Center, Taiwan",
      "Philips Research North America, United States",
      "Moscow Institute of Physics and Technology (State University), Russia",
      "Moscow Institute of Physics and Technology, Russia",
      "Evgeny Sokolov, PhD researcher at Moscow Institute of Physics and Technologies, Russia",
      "MIPT, Russia",
      "Image recognition and text processing group at Deparment of Innovations and High technology (DIHT), Moscow institute of physics and technology (MIPT), Russia",
      "Ecole polytechnique, France",
      "Ecole Polytechnique, France",
      "Penn State, United States",
      "Penn State University, United States",
      "Hangzhou 9ji Technology Co., Ltd., China",
      "Tencent Holdings Ltd, China",
      "university of science & technology beijing, China",
      "SenseTime.Inc, China",
      "south china university of technology, China",
      "software engineering,NUAA in nanjing ,China, China",
      "Huaiyin Institute Of Technology, China",
      "wuyi university, China",
      "xiamen university of china, China",
      "Shenzhen Zhongchao XinDa Financial Technologies Ltd, China",
      "Key Laboratory of Intelligent Computation & Signal Processing, Ministry of Education, Anhui University, Hefei, China, China",
      "HUBEI UNIVERSITY, China",
      "Southeast University, China, China",
      "Shenzhen university, China",
      "Wuhan University, China",
      "Yanshan University In China, China",
      "alibaba, China",
      "SenseTime Group Limited, China",
      "sensetime, China",
      "Sensetime, China",
      "lixiaojie@sensetime.com, China",
      "UMASS LOWELL, United States",
      "Computer Science, Texas A&M, United States",
      "Tencent Beijing Office, China",
      "youtu.sng.tencent, China",
      "Tencent YouTu Lab, China",
      "shanghai,China, China",
      "Platform RD Group 2, China",
      "YouTu Lab, Tencent, China",
      "tencent, China",
      "university of maryland, college park, United States",
      "University of Mia, United States",
      "UMICH, United States",
      "University of Rhode Island @ Computer Science and Statistics, United States",
      "IBM Research, United States",
      "Panasonic, United States",
      "The University of Texas at Dallas, United States",
      "University of Toledo, United States",
      "The university of tennessee, knxoville, United States",
      "no affiliation, personal project, United State",
    ],
  },
  {
    year: 2019,
    entries: [
      "Seoul National University, South Korea",
      "xianweilv, China",
      "Belarusian State University of Informatics and Radioelectronics, Belarus",
      "Home, Turkey",
      "Hanyang University, South Korea",
      "employee, Australia",
      "Feitian Japan, Japan",
      "Northwestern University, United States",
      "Chongqing University of Posts and Telecommunications, China",
      "iiitd, India",
      "Department of Electronic Engineering, Tsinghua University, China",
      "GMTech Inc, Anguilla",
      "American University in Cairo, Egypt",
      "HanKuk University of Foreign Studies, South Korea",
      "Indian Institute of Science(IISc), India",
      "Kaist (Korea Advanced Institute of science and technology), South Korea",
      "Gwangju Institute of Science and Technology, South Korea",
      "University of Colorado, Boulder, United States",
      "RUDN University, Russia",
      "shahid beheshti university, Iran",
      "Moscow institute of physics and technology, Russia",
      "Delft University of Technology, Netherlands",
      "Tianjin University, China",
      "Staqu Technologies, India",
      "Innopolis University, Russian Federation",
      "National Chiao Tung University, Taiwan",
      "Seikei univercity, Japan",
      "Le Ba Tuan Anh, Vietnam",
      "abdalaziz rashid, Russia",
      "CASIA, China",
      "Professor, Brazil",
      "zhejiang university, China",
      "University of Notre Dame, United States",
      "Yokohama National University, Japan",
      "XIX.ai, Anguilla",
      "Institute of Control Science of RAS, Russia",
      "Southeast University, China",
      "University of Science and Technology of China, China",
      "personal project, Taiwan",
      "Norwegian University of Science and Technology, Norway",
      "Nanjing University, China",
      "National Taiwan University, Taiwan",
      "Dalton, Indonesia",
      "Stanford University, United States",
      "KanazawaGakuinUniversity, Japan",
      "Individual, Japan",
      "South China University of Technology(SCUT), China",
      "Ho Chi Minh University of Technology, Viet Nam",
      "By Techdesign, Spain",
      "Tongji University, China",
      "Computer Science Institute, China",
      "EORA Data Lab, Russia",
      "ÉTS, Canada",
      "jiang shan, China",
      "Xidian, China",
      "Anyvision, Colombia",
      "URFU, Russia",
      "Belgorod state university, Belgorod, Russia, Russia",
      "Development Team, British Indian Ocean Territory",
      "NSU, Russia",
      "McMaster University, Canada",
      "Beijing University of Chemical Technology, China",
      "beijing institute of technology, China",
      "EE, South Korea",
      "Amirkabir University of Technology, Iran, Islamic Republic of",
      "Michigan State University, United States",
      "Microsoft, United States",
      "Rokid R-Lab, Anguilla",
      "National University of Singapore, Singapore",
      "Dalian University of Technology, China",
      "School of Computer Science, Wuhan University, China, China",
      "Chulalongkorn University, Thailand",
      "Northwestern Polytechnical University, China",
      "NLPR, CASIA, China",
      "Wongyufei, China",
      "Politehnica University of Bucharest, Romania",
      "Sun Yat-sen University, China",
      "University of Minnesota - Twin Cities, United States",
      "national chung cheng university, Taiwan",
      "Ubiquitous Laboratory, Japan",
      "INA, Saint Martin",
      "Universiti Malaysia Sabah, Jalan UMS, 88400, Kota Kinabalu, Sabah, Malaysia, China",
      "Jason, Australia",
      "Xi'an University of Posts and Telecommunications, China",
      "INRIA, France",
      "University of Waterloo, Canada",
      "TripleIze, Japan",
      "CDAC India, India",
      "Facebook, United States",
      "AI Team, Japan",
      "Facultad de Ingeniería, Universidad de la República, Uruguay, Uruguay",
      "University, Russia",
      "Intel, United States",
      "Researchers, South Africa",
      "National Chiao Tung University, Taiwan",
      "Universiti Sains Malaysia, Malaysia",
      "Sri Sathya Sai Insitiute of Higher Learning, India",
      "Southern Alberta Institute of Technology, Canada",
      "University of Leon, Spain",
      "Virginia Tech, United States",
      "Tsinghua University, China",
      "University of Electronic Science and Technology of China, China",
      "VinAI Research, British Indian Ocean Territory",
      "ftech.ai, Anguilla",
      "University of Western Ontario, Canada",
      "Centre for Development of Advanced Computing, India",
      "Galacrity, Anguilla",
      "Tecnologico de Monterrey, Mexico",
      "ANNA UNIVERSITY, India",
      "Hochschule Darmstadt, Germany",
      "ByteCorp, British Indian Ocean Territory",
      "Teacher, China",
      "Samara Univercity, Russia",
      "yonsei university, South Korea",
      "Zhejiang University, China",
      "taiwan, Taiwan",
      "Soochow University, China",
      "deep-percept, Japan",
      "Personal use, Belgium",
      "KAIST, South Korea",
      "Florida Atlantic University, United States",
      "Kookmin University, South Korea",
      "法政大学大学院, Japan",
      "National University of Science and Technology, Pakistan",
      "Samsung Electronics, Canada",
      "PES University, India",
      "Nanjing university, China",
      "Akdeniz University, Turkey",
      "NRNU MEPhI, Russia",
      "None, Belarus",
      "King Mongkut's Institute of Technology Ladkrabang, Thailand",
      "University of Michigan, United States",
      "University of Melbourne, Australia",
      "Jiwei Xu, China",
      "University of Minnesota, United States",
      "Intelbras, Brazil",
      "cnu, China",
      "Employee, Japan",
      "Griffith University, Australia",
      "National Taiwan University of Science and Technology, Taiwan",
      "Nation Taiwan University, Taiwan",
      "National Chiao Tung University, Taiwan, Taiwan",
      "ISEN, Saint Martin",
      "Academic research (master thesis), Italy",
      "jimzheng@hku.hk, Hong Kong",
      "National Cheng Kung University, Taiwan",
      "Perm State University, Russia",
      "sdudent, China",
      "new, Spain",
      "University of Campinas, Brazil",
      "phd, South Korea",
      "DST Group, Edinburgh, Australia., Australia",
      "University of Chinese Academy of Sciences, China",
      "Clarkson University, United States",
      "Faculty of electrical engineering and computing, University of Zagreb, Croatia",
      "NOTA, Anguilla",
      "Ircam, Saint Martin",
      "University of Liverpool, United Kingdom",
      "Electronics and Telecommunications Research Institute, South Korea",
      "Dr. Suharjito, S.Si., MT, Binus University, Indonesia",
      "Inha University, South Korea",
      "University of Belgrade, Serbia",
      "UniFOA (Volta Redonda University Center), Brazil",
      "FPT Corporation, Vietnam",
      "Researcher, Italy",
      "LG Electronics, South Korea",
      "VESA, Vietnam",
      "日本大学, Japan",
      "University of Iowa, United States",
      "Qihoo 360 Technology Co. Ltd., China",
      "Image processing, China",
      "Shandong University, China, China",
      "Shanghai Clever mRobot Technologies Co.,Ltd, China",
      "hikvision, China",
      "Tsinghua University of China, China",
      "China University of Mining and Technology, Beijing, China",
      "CAD&CG State key Laboratory of China, China",
      "alibaba inc, China",
      "sichuan university, China",
      "Southwest University of Science and Technology, China",
      "NUAA, China",
      "Alibaba Group, China",
      "University Of Electronic Science And Technology Of China, China",
      "chinese academy of science, China",
      "College of computer, National University of Defense Technology, China",
      "wuhan university, China",
      "Central South University in China, China",
      "Tsinghua, China",
      "Sun yat-sen university, China",
      "China NanJing university of scientist and technology, China",
      "Guangdong University of Technology, Guangzhou, China, China",
      "Canon Information Technology (Beijing) Co., Ltd., China",
      "shenzhen university, China",
      "national university of defense technology, China",
      "Ping An Technology, China",
      "shang hai university, China",
      "the Second Institute of China Aerospace Science and Technology Corporation, China",
      "North China University of Water Resources and Electric Power, China",
      "baidu, China",
      "ShenZhen university, China",
      "university of science and technology of beijing,china, China",
      "BitEye Inc., China",
      "BUPT, China, China",
      "school of computer science and technology ShanDong University,China, China",
      "liaoning university, China",
      "Huawei, China",
      "liaocheng university, CHN",
      "Shanghai Institute of Technical Physics, Chinese Academy of Sciences, China",
      "south china university of techonology, China",
      "PingAn Life Insurance of China, China",
      "Adobe Research, United States",
      "Affectiva, United States",
      "affectiva, United States",
      "SHENZHEN UNIVERSITY, China",
      "Alibaba Cloud, China",
      "Alibaba Robot Company, China",
      "iDST, Alibaba, China",
      "Alibaba, University of Washington, China",
      "Alibaba Inc., China",
      "alibaba, China",
      "Align Technology, Inc., China",
      "Independent researcher, United States",
      "Baidu company, China",
      "Bitmain, China",
      "ByteDance, China",
      "China 's Chengdu City, Sichuan Province XinZhouRuiShi Technology Co; http://www.cdxzrs.com/ , China",
      "China Electronics Technology Group Corporation, China",
      "Cisco, United States",
      "Cisco Systems, United States",
      "Central Michigan University, United States",
      "Cognitec Systems GmbH, Germany",
      "Harvard College, United States",
      "columbia univeristy, United States",
      "columbia, United States",
      "Columbia, United States",
      "CMU, United States",
      "facial recognition researcher, United States",
      "UMass Amherst, United States",
      "UMass, United States",
      "UT Austin, United States",
      "UW, United States",
      "TEST, United States",
      "Industry/DoD, United States",
      "Graduate Research Assistant, United States",
      "R & D, United States",
      "DeepGlint, Beijing, China, China",
      "Government, United States",
      "Duke University Graduate Student, United States",
      "United States Army Research Laboratory (ARL), United States",
      "ARL, United States",
      "uta, United States",
      "UT Arlington, United States",
      "Megvii Inc, China",
      "Megvii Inc., China",
      "+86 15255105537, United States",
      "+86 13262898762, United States",
      "Microsoft Bing Multimedia Team, United States",
      "microsoft, United States",
      "Undergraduate Researcher, United States",
      "Massachusetts Institute of Technology, United States",
      "Research Assistant, United States",
      "WVU, United States",
      "Morpx, Inc, Hangzhou, China, 310000, China",
      "Naver Inc., South Korea",
      "NAVER CLOVA AI RESEARCH, South Korea",
      "naver, South Korea",
      "Naver corp., South Korea",
      "BCSU, United States",
      "Dept. of Electrical and Computer Engineering, United States",
      "civil engineering, United States",
      "north carolina state university, United States",
      "NEC laboratories America, Inc, United States",
      "Neurotechnology, Lithuania",
      "General Manager, Turkey",
      "Noblis, United States",
      "Noblis Corporation, United States",
      "The New York Times, United States",
      "New York University / Tisch School of Arts, United States",
      "NYU Shanghai, United States",
      "NYU, United States",
      "ECE at Ohio State University, United States",
      "Computer Vision, Taiwan",
      "Mobile Communication Product Develop Center, Taiwan",
      "Philips Research North America, United States",
      "Moscow Institute of Physics and Technology (State University), Russia",
      "Moscow Institute of Physics and Technology, Russia",
      "Evgeny Sokolov, PhD researcher at Moscow Institute of Physics and Technologies, Russia",
      "MIPT, Russia",
      "Image recognition and text processing group at Deparment of Innovations and High technology (DIHT), Moscow institute of physics and technology (MIPT), Russia",
      "Ecole polytechnique, France",
      "Ecole Polytechnique, France",
      "Penn State, United States",
      "Penn State University, United States",
      "Hangzhou 9ji Technology Co., Ltd., China",
      "Tencent Holdings Ltd, China",
      "university of science & technology beijing, China",
      "SenseTime.Inc, China",
      "south china university of technology, China",
      "software engineering,NUAA in nanjing ,China, China",
      "Huaiyin Institute Of Technology, China",
      "wuyi university, China",
      "xiamen university of china, China",
      "Shenzhen Zhongchao XinDa Financial Technologies Ltd, China",
      "Key Laboratory of Intelligent Computation & Signal Processing, Ministry of Education, Anhui University, Hefei, China, China",
      "HUBEI UNIVERSITY, China",
      "Southeast University, China, China",
      "Shenzhen university, China",
      "Wuhan University, China",
      "Yanshan University In China, China",
      "alibaba, China",
      "SenseTime Group Limited, China",
      "sensetime, China",
      "Sensetime, China",
      "lixiaojie@sensetime.com, China",
      "UMASS LOWELL, United States",
      "Computer Science, Texas A&M, United States",
      "Tencent Beijing Office, China",
      "youtu.sng.tencent, China",
      "Tencent YouTu Lab, China",
      "shanghai,China, China",
      "Platform RD Group 2, China",
      "YouTu Lab, Tencent, China",
      "tencent, China",
      "university of maryland, college park, United States",
      "University of Mia, United States",
      "UMICH, United States",
      "University of Rhode Island @ Computer Science and Statistics, United States",
      "IBM Research, United States",
      "Panasonic, United States",
      "The University of Texas at Dallas, United States",
      "University of Toledo, United States",
      "The university of tennessee, knxoville, United States",
      "no affiliation, personal project, United State",
    ],
  },
];
