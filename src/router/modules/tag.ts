import TablerTagFilled from '~icons/tabler/tag-filled';

export default {
  path: "/tag",
  redirect: "/tag/index",
  meta: {
    icon: TablerTagFilled,
    title: "标签",
    rank: 2
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
