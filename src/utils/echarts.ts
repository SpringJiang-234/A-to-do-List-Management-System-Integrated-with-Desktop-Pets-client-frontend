// utils/echarts.ts
import * as echarts from "echarts/core";

// 导入图表类型（官方图表）
import {
  BarChart,
  LineChart,
  PieChart,
  HeatmapChart
} from "echarts/charts";

// 导入组件
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  CalendarComponent
} from "echarts/components";

// 导入特性与渲染器
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

// 注册组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  VisualMapComponent,
  CalendarComponent,
  BarChart,
  LineChart,
  PieChart,
  HeatmapChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

// 导出配置好的 echarts 实例
export default echarts;

// ---------- TypeScript 类型导出 ----------
import type { ComposeOption } from "echarts/core";
import type {
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  HeatmapSeriesOption
} from "echarts/charts";
import type {
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
  GridComponentOption,
  VisualMapComponentOption,
  CalendarComponentOption
} from "echarts/components";

// 组合所有可能的配置项类型
export type ECOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | HeatmapSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | LegendComponentOption
  | GridComponentOption
  | VisualMapComponentOption
  | CalendarComponentOption
>;