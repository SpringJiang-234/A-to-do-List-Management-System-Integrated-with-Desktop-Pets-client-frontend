export default {
  path: "/settings",
  redirect: "/settings/index",
  meta: {
    title: "设置"
  },
  children: [
    {
      path: "/settings/index",
      name: "Settings",
      component: () => import("@/views/settings/index.vue"),
      meta: {
        title: "设置"
      }
    }
  ]
};
