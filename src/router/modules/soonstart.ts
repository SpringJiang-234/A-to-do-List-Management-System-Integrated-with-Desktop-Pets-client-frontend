export default {
  path: "/soonstart",
  redirect: "/soonstart/index",
  meta: {
    title: "快速开始"
  },
  children: [
    {
      path: "/soonstart/index",
      name: "Soonstart",
      component: () => import("@/views/soonstart/index.vue"),
      meta: {
        title: "快速开始"
      }
    }
  ]
};
