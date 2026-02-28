import MdiClockOutline from '~icons/mdi/clock-outline';

export default {
  path: "/soonstart",
  redirect: "/soonstart/index",
  meta: {
    icon: MdiClockOutline,
    title: "快速开始计时",
    rank: 4
  },
  children: [
    {
      path: "/soonstart/index",
      name: "Soonstart",
      component: () => import("@/views/soonstart/index.vue"),
      meta: {
        title: "快速开始计时"
      }
    }
  ]
};
