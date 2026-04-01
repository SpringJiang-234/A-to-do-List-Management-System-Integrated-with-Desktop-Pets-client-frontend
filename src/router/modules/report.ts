import TablerReportAnalytics from "~icons/tabler/report-analytics";

export default {
  path: "/report",
  redirect: "/report/index",
  meta: {
    icon: TablerReportAnalytics,
    title: "报表",
    rank: 6
  },
  children: [
    {
      path: "/report/index",
      name: "Report",
      component: () => import("@/views/report/index.vue"),
      meta: {
        title: "报表"
      }
    },
    {
      path: "/report/daily",
      name: "DailyReport",
      component: () => import("@/views/report/components/DailyReport.vue"),
      meta: {
        title: "本日报表",
        showLink: false
      }
    },
    {
      path: "/report/weekly",
      name: "WeeklyReport",
      component: () => import("@/views/report/components/WeeklyReport.vue"),
      meta: {
        title: "本周报表",
        showLink: false
      }
    },
    {
      path: "/report/monthly",
      name: "MonthlyReport",
      component: () => import("@/views/report/components/MonthlyReport.vue"),
      meta: {
        title: "本月报表",
        showLink: false
      }
    },
    {
      path: "/report/yearly",
      name: "YearlyReport",
      component: () => import("@/views/report/components/YearlyReport.vue"),
      meta: {
        title: "本年报表",
        showLink: false
      }
    },
    {
      path: "/report/custom",
      name: "CustomReport",
      component: () => import("@/views/report/components/CustomReport.vue"),
      meta: {
        title: "自定义报表",
        showLink: false
      }
    }
  ]
};
