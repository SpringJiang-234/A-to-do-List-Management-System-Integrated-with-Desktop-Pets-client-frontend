import DashiconsCategory from '~icons/dashicons/category';

export default {
  path: "/category",
  redirect: "/category/index",
  meta: {
    icon: DashiconsCategory,
    title: "分类",
    rank: 1
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
