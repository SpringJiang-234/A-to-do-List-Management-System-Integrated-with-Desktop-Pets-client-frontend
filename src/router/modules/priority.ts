import IconParkSolidFourKey from "~icons/icon-park-solid/four-key";

export default {
  path: "/priority",
  redirect: "/priority/index",
  meta: {
    icon: IconParkSolidFourKey,
    title: "优先级",
    rank: 4
  },
  children: [
    {
      path: "/priority/index",
      name: "Priority",
      component: () => import("@/views/priority/index.vue"),
      meta: {
        title: "优先级"
      }
    }
  ]
};
