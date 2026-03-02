import TablerReportAnalytics from '~icons/tabler/report-analytics';

export default {
  path: "/report",
  redirect: "/report/index",
  meta: {
    icon: TablerReportAnalytics,
    title: "报表",
    rank: 5
  },
  children: [
    {
      path: "/report/index",
      name: "Report",
      component: () => import("@/views/report/index.vue"),
      meta: {
        title: "报表"
      }
    }
  ]
};
