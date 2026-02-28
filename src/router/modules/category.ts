export default {
  path: "/category",
  redirect: "/category/index",
  meta: {
    title: "分类"
  },
  children: [
    {
      path: "/category/index",
      name: "Category",
      component: () => import("@/views/category/index.vue"),
      meta: {
        title: "分类"
      }
    }
  ]
};
