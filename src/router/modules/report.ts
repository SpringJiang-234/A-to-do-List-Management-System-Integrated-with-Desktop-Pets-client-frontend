export default {
  path: "/report",
  redirect: "/report/index",
  meta: {
    title: "报告"
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
