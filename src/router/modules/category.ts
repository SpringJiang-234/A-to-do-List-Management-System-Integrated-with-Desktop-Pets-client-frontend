import DashiconsCategory from "~icons/dashicons/category";
import MaterialSymbolsLightDocsOutlineRounded from "~icons/material-symbols-light/docs-outline-rounded?width=16px&height=16px";
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
        icon: DashiconsCategory,
        title: "全部"
      }
    }
  ]
};

export function generateCategoryRoutes(
  categories: Category[]
): RouteRecordRaw[] {
  return categories.map(category => ({
    path: `/category/${category.id}/index`,
    name: category.name.charAt(0).toUpperCase() + category.name.slice(1),
    component: () => import("@/views/category/index.vue"),
    meta: {
      icon: MaterialSymbolsLightDocsOutlineRounded,
      title: category.title,
      categoryId: category.id
    }
  }));
}
