import TablerTagFilled from '~icons/tabler/tag-filled';
import type { RouteRecordRaw } from "vue-router";

interface Tag {
  id: number;
  name: string;
  path: string;
  title: string;
}

export default {
  path: "/tag",
  name: "TagParent",
  redirect: "/tag/index",
  meta: {
    icon: TablerTagFilled,
    title: "标签",
    rank: 3
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

export function generateTagRoutes(tags: Tag[]): RouteRecordRaw[] {
  return tags.map(tag => ({
    path: `/tag/${tag.name}/index`,
    name: tag.name.charAt(0).toUpperCase() + tag.name.slice(1),
    component: () => import("@/views/tag/index.vue"),
    meta: {
      title: tag.title
    }
  }));
}
