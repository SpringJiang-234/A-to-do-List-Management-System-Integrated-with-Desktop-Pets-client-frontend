import IconParkOutlineAnnouncement from "~icons/icon-park-outline/announcement";

export default {
  path: "/announcement",
  redirect: "/announcement/index",
  meta: {
    icon: IconParkOutlineAnnouncement,
    title: "公告",
    rank: 7
  },
  children: [
    {
      path: "/announcement/index",
      name: "Announcement",
      component: () => import("@/views/announcement/index.vue"),
      meta: {
        title: "公告"
      }
    },
    {
      path: "/announcement/detail/:id",
      name: "AnnouncementDetail",
      component: () => import("@/views/announcement/detail.vue"),
      meta: {
        title: "公告详情",
        showLink: false
      }
    }
  ]
};
