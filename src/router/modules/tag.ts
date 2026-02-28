export default {
  path: "/tag",
  redirect: "/tag/index",
  meta: {
    title: "标签"
  },
  children: [
    {
      path: "/tag/index",
      name: "Tag",
      component: () => import("@/views/tag/index.vue"),
      meta: {
        title: "标签"
      }
    }
  ]
};
