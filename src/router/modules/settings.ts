import UilSetting from '~icons/uil/setting';

export default {
  path: "/settings",
  redirect: "/settings/index",
  meta: {
    icon: UilSetting,
    title: "设置",
    rank: 5
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
