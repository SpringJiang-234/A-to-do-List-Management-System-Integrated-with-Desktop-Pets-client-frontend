// color.ts

// 主题类型
export type ThemeType =
  | "light"
  | "default"
  | "saucePurple"
  | "pink"
  | "dusk"
  | "volcano"
  | "mingQing"
  | "auroraGreen";

// 主题系列颜色
export const themeSeriesColors: Record<ThemeType, string[]> = {
  light: [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc"
  ],
  default: [
    "#4091f7",
    "#59bfc1",
    "#693ac9",
    "#d84493",
    "#e13c39",
    "#e85f33",
    "#60ac80",
    "#52c41a",
    "#13c2c2"
  ],
  saucePurple: [
    "#693ac9",
    "#9254de",
    "#b37feb",
    "#d3adf7",
    "#efdbff",
    "#722ed1",
    "#531dab",
    "#391085",
    "#22075e"
  ],
  pink: [
    "#eb2f96",
    "#f759ab",
    "#ffadd2",
    "#ff85c0",
    "#ffafff",
    "#c41d7f",
    "#9e1068",
    "#780650",
    "#520339"
  ],
  dusk: [
    "#f5222d",
    "#ff4d4f",
    "#ff7875",
    "#ff9c6e",
    "#ffc9c9",
    "#cf1322",
    "#a8071a",
    "#820014",
    "#5c0011"
  ],
  volcano: [
    "#fa541c",
    "#ff7a45",
    "#ffa940",
    "#ffc53d",
    "#ffe58f",
    "#d4380d",
    "#ad2102",
    "#871400",
    "#610b00"
  ],
  mingQing: [
    "#13c2c2",
    "#36cfc9",
    "#5cdbd3",
    "#87e8de",
    "#b5f5ec",
    "#08979c",
    "#006d75",
    "#00474f",
    "#002329"
  ],
  auroraGreen: [
    "#52c41a",
    "#73d13d",
    "#95de64",
    "#b7eb8f",
    "#d9f7be",
    "#389e0d",
    "#237804",
    "#135200",
    "#092b00"
  ]
};

// 获取系列颜色
export const getSeriesColor = (theme: ThemeType, index: number): string => {
  const colors = themeSeriesColors[theme] || themeSeriesColors.default;
  return colors[index % colors.length];
};

// 热力图颜色
export const heatmapColors: Record<ThemeType, string[]> = {
  light: [
    "#ffffff",
    "#e6f7ff",
    "#bae7ff",
    "#91d5ff",
    "#69c0ff",
    "#40a9ff",
    "#1890ff",
    "#096dd9",
    "#0050b3",
    "#003a8c"
  ],
  default: [
    "#ffffff",
    "#e6f7ff",
    "#bae7ff",
    "#91d5ff",
    "#69c0ff",
    "#40a9ff",
    "#1890ff",
    "#096dd9",
    "#0050b3",
    "#003a8c"
  ],
  saucePurple: [
    "#ffffff",
    "#f9f0ff",
    "#efdbff",
    "#d3adf7",
    "#b37feb",
    "#9254de",
    "#722ed1",
    "#531dab",
    "#391085",
    "#22075e"
  ],
  pink: [
    "#ffffff",
    "#fff0f6",
    "#ffd6e7",
    "#ffadd2",
    "#ff85c0",
    "#f759ab",
    "#eb2f96",
    "#c41d7f",
    "#9e1068",
    "#520339"
  ],
  dusk: [
    "#ffffff",
    "#fff1f0",
    "#ffccc7",
    "#ffa39e",
    "#ff7875",
    "#ff4d4f",
    "#f5222d",
    "#cf1322",
    "#a8071a",
    "#5c0011"
  ],
  volcano: [
    "#ffffff",
    "#fff7e6",
    "#ffd591",
    "#ffc069",
    "#ffa940",
    "#fa8c16",
    "#fa541c",
    "#d4380d",
    "#ad2102",
    "#610b00"
  ],
  mingQing: [
    "#ffffff",
    "#e6fffb",
    "#b5f5ec",
    "#87e8de",
    "#5cdbd3",
    "#36cfc9",
    "#13c2c2",
    "#08979c",
    "#006d75",
    "#002329"
  ],
  auroraGreen: [
    "#ffffff",
    "#f6ffed",
    "#d9f7be",
    "#b7eb8f",
    "#95de64",
    "#73d13d",
    "#52c41a",
    "#389e0d",
    "#237804",
    "#092b00"
  ]
};

// 获取热力图颜色
export const getHeatmapColors = (theme: ThemeType): string[] => {
  return heatmapColors[theme] || heatmapColors.default;
};