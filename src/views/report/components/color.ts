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