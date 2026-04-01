// color.ts

// 主题类型
export type ThemeType = "light" | "dark" | "auto";

// 亮色主题颜色
export const lightColors = [
  "#5470c6",
  "#91cc75",
  "#fac858",
  "#ee6666",
  "#73c0de",
  "#3ba272",
  "#fc8452",
  "#9a60b4",
  "#ea7ccc"
];

// 暗色主题颜色
export const darkColors = [
  "#91cc75",
  "#fac858",
  "#ee6666",
  "#73c0de",
  "#3ba272",
  "#fc8452",
  "#9a60b4",
  "#ea7ccc",
  "#5470c6"
];

// 获取系列颜色
export const getSeriesColor = (theme: ThemeType, index: number): string => {
  const colors = theme === "dark" ? darkColors : lightColors;
  return colors[index % colors.length];
};

// 热力图颜色
export const heatmapColors = {
  light: [
    "#e6f7ff",
    "#bae7ff",
    "#91d5ff",
    "#69c0ff",
    "#40a9ff",
    "#1890ff",
    "#096dd9",
    "#0050b3",
    "#003a8c",
    "#002766"
  ],
  dark: [
    "#1a1a2e",
    "#16213e",
    "#0f3460",
    "#16213e",
    "#1a1a2e",
    "#0f3460",
    "#16213e",
    "#1a1a2e",
    "#0f3460",
    "#16213e"
  ]
};

// 获取热力图颜色
export const getHeatmapColors = (theme: ThemeType): string[] => {
  return heatmapColors[theme === "dark" ? "dark" : "light"];
};