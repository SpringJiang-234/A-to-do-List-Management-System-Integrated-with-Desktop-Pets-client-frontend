import MdiClockOutline from "~icons/mdi/clock-outline";

export default {
  path: "/soonstart",
  redirect: "/soonstart/index",
  meta: {
    icon: MdiClockOutline,
    title: "开始计时",
    rank: 5
  },
  children: [
    {
      path: "/soonstart/index",
      name: "Soonstart",
      component: () => import("@/views/soonstart/index.vue"),
      meta: {
        title: "开始计时"
      }
    }
  ]
};
