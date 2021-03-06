export interface ImageMetaData {
  url: string;
  path_alias: string;
  nsid: string;
  photo_id: ImageIds;
  license: string;
  date: string;
  year: Years;
  tagged: Tagged;
}

export type ImageIds = typeof imageData[number]["photo_id"];
type Years = typeof imageData[number]["year"];
type Tagged = typeof imageData[number]["tagged"];

export const imageData = [
  {
    url: "102631694_ddcba3652b",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 102631694,
    license: "by-sa",
    date: "Feb 2006",
    year: 2006,
    tagged: "wedding",
  },
  {
    url: "5708843240_493b303411",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5708843240,
    license: "by-sa",
    date: "May 2011",
    year: 2011,
    tagged: "family",
  },
  {
    url: "4760340061_ca631f017b",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 4760340061,
    license: "by-sa",
    date: "Jul 2010",
    year: 2010,
    tagged: "party",
  },
  {
    url: "4761000698_94acb982cf",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 4761000698,
    license: "by-sa",
    date: "Jul 2010",
    year: 2010,
    tagged: "party",
  },
  {
    url: "4760989044_c1964bc937",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 4760989044,
    license: "by-sa",
    date: "Jul 2010",
    year: 2010,
    tagged: "family",
  },
  {
    url: "5181105296_a3945e3326",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5181105296,
    license: "by-sa",
    date: "Nov 2010",
    year: 2010,
    tagged: "family",
  },
  {
    url: "5483477396_310a3c7915",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5483477396,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "party",
  },
  {
    url: "5181112588_6527bc8401",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5181112588,
    license: "by-sa",
    date: "Nov 2010",
    year: 2010,
    tagged: "family",
  },
  {
    url: "356458200_e3f608fc47",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 356458200,
    license: "by-sa",
    date: "Jan 2007",
    year: 2007,
    tagged: "party",
  },
  {
    url: "121728236_c66af13aa0",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 121728236,
    license: "by-sa",
    date: "Apr 2006",
    year: 2006,
    tagged: "party",
  },
  {
    url: "121728398_f30a644bd1",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 121728398,
    license: "by-sa",
    date: "Apr 2006",
    year: 2006,
    tagged: "party",
  },
  {
    url: "5294587830_cc32305ef0",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5294587830,
    license: "by-sa",
    date: "Dec 2010",
    year: 2010,
    tagged: "family",
  },
  {
    url: "9432741384_71097c4068",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 9432741384,
    license: "by-sa",
    date: "Aug 2013",
    year: 2013,
    tagged: "wedding",
  },
  {
    url: "9432532574_011f002ee6",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 9432532574,
    license: "by-sa",
    date: "Aug 2013",
    year: 2013,
    tagged: "wedding",
  },
  {
    url: "5293990665_fc71770475",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5293990665,
    license: "by-sa",
    date: "Dec 2010",
    year: 2010,
    tagged: "family",
  },
  {
    url: "9429824331_f18045ff8e",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 9429824331,
    license: "by-sa",
    date: "Aug 2013",
    year: 2013,
    tagged: "family",
  },
  {
    url: "10090346453_a0c4a59ded",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 10090346453,
    license: "by-sa",
    date: "Oct 2013",
    year: 2013,
    tagged: "party",
  },
  {
    url: "5431706769_823306648f",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5431706769,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "wedding",
  },
  {
    url: "5181078830_95e0ca1451",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5181078830,
    license: "by-sa",
    date: "Nov 2010",
    year: 2010,
    tagged: "family",
  },
  {
    url: "5181106232_f1aff59293",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5181106232,
    license: "by-sa",
    date: "Nov 2010",
    year: 2010,
    tagged: "family",
  },
  {
    url: "5294592150_d7336091f6",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5294592150,
    license: "by-sa",
    date: "Dec 2010",
    year: 2010,
    tagged: "family",
  },
  {
    url: "5432271046_1e485d7b8b",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5432271046,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "party",
  },
  {
    url: "5482917593_5fa01467a2",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5482917593,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "family",
  },
  {
    url: "4760348817_8b3d967eef",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 4760348817,
    license: "by-sa",
    date: "Jul 2010",
    year: 2010,
    tagged: "family",
  },
  {
    url: "5432404966_dde385f6e0",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5432404966,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "party",
  },
  {
    url: "5483509674_4c79f20f9d",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5483509674,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "family",
  },
  {
    url: "5482919569_cf207cd08a",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5482919569,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "family",
  },
  {
    url: "5483538802_581ff4428b",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5483538802,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "family",
  },
  {
    url: "7178904372_3217ec6a6e",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 7178904372,
    license: "by-sa",
    date: "May 2012",
    year: 2012,
    tagged: "family",
  },
  {
    url: "5482914785_c2bf0f2b8f",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5482914785,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "family",
  },
  {
    url: "5204657998_0b78903bdb",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5204657998,
    license: "by-sa",
    date: "Nov 2010",
    year: 2010,
    tagged: "family",
  },
  {
    url: "5294593494_be13bc754b",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5294593494,
    license: "by-sa",
    date: "Dec 2010",
    year: 2010,
    tagged: "family",
  },
  {
    url: "5180507305_58be2beff6",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5180507305,
    license: "by-sa",
    date: "Nov 2010",
    year: 2010,
    tagged: "family",
  },
  {
    url: "1073107755_93470b17e6",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 1073107755,
    license: "by-sa",
    date: "Aug 2007",
    year: 2007,
    tagged: "family",
  },
  {
    url: "5431693087_15fe145248",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5431693087,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "wedding",
  },
  {
    url: "541498201_e81e06da19",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 541498201,
    license: "by-sa",
    date: "Jun 2007",
    year: 2007,
    tagged: "family",
  },
  {
    url: "541580657_fc757ed7b3",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 541580657,
    license: "by-sa",
    date: "Jun 2007",
    year: 2007,
    tagged: "family",
  },
  {
    url: "541454120_ba1028b86e",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 541454120,
    license: "by-sa",
    date: "Jun 2007",
    year: 2007,
    tagged: "wedding",
  },
  {
    url: "5431693889_4e69c9424f",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5431693889,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "wedding",
  },
  {
    url: "9432753664_14120269f9",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 9432753664,
    license: "by-sa",
    date: "Aug 2013",
    year: 2013,
    tagged: "family",
  },
  {
    url: "5431715775_faef2ae9a8",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5431715775,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "party",
  },
  {
    url: "5477736988_baf34293e2",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5477736988,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "family",
  },
  {
    url: "5477736726_3a4679875e",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5477736726,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "family",
  },
  {
    url: "5080789669_1e66d12d3b",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5080789669,
    license: "by-sa",
    date: "Oct 2010",
    year: 2010,
    tagged: "party",
  },
  {
    url: "5477735920_8afa4b75a9",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 5477735920,
    license: "by-sa",
    date: "Feb 2011",
    year: 2011,
    tagged: "family",
  },
  {
    url: "356480744_03c2c3232b",
    path_alias: "etherworks",
    nsid: "94433649@N00",
    photo_id: 356480744,
    license: "by-sa",
    date: "Jan 2007",
    year: 2007,
    tagged: "family",
  },
] as const;
