import TablerReportAnalytics from '~icons/tabler/report-analytics';

export default {
  path: "/report",
  redirect: "/report/index",
  meta: {
    icon: TablerReportAnalytics,
    title: "报告",
    rank: 4
  },
  children: [
    {
      path: "/report/index",
      name: "Report",
      component: () => import("@/views/report/index.vue"),
      meta: {
        title: "报告"
      }
    }
  ]
};
