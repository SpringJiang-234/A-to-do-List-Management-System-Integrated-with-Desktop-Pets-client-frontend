import FamiconsPerson from '~icons/famicons/person';

export default {
  path: "/usercenter",
  redirect: "/usercenter/index",
  meta: {
    icon: FamiconsPerson,
    title: "个人中心",
    rank: 8
  },
  children: [
    {
      path: "/usercenter/index",
      name: "UserCenter",
      component: () => import("@/views/usercenter/index.vue"),
      meta: {
        title: "个人中心"
      }
    }
  ]
};
