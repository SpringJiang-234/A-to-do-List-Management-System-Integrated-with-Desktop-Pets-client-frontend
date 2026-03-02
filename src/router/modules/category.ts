import DashiconsCategory from '~icons/dashicons/category';
import type { RouteRecordRaw } from "vue-router";

interface Category {
  id: number;
  name: string;
  path: string;
  title: string;
}

export default {
  path: "/category",
  name: "CategoryParent",
  redirect: "/category/index",
  meta: {
    icon: DashiconsCategory,
    title: "分类",
    rank: 2
  },
  children: [
    {
      path: "/category/index",
      name: "Category",
      component: () => import("@/views/category/index.vue"),
      meta: {
        title: "未分类"
      }
    }
  ]
};

export function generateCategoryRoutes(categories: Category[]): RouteRecordRaw[] {
  return categories.map(category => ({
    path: `/category/${category.name}/index`,
    name: category.name.charAt(0).toUpperCase() + category.name.slice(1),
    component: () => import("@/views/category/index.vue"),
    meta: {
      title: category.title
    }
  }));
}
