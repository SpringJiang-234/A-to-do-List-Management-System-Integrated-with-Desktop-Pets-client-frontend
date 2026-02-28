import LetsIconsSettingFill from '~icons/lets-icons/setting-fill';

export default {
  path: "/settings",
  redirect: "/settings/index",
  meta: {
    icon: LetsIconsSettingFill,
    title: "设置",
    rank: 10
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
