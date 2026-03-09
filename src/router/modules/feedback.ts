import IxFeedback from '~icons/ix/feedback';

export default {
  path: "/feedback",
  redirect: "/feedback/index",
  meta: {
    icon: IxFeedback,
    title: "反馈",
    rank: 8
  },
  children: [
    {
      path: "/feedback/index",
      name: "Feedback",
      component: () => import("@/views/feedback/index.vue"),
      meta: {
        title: "反馈"
      }
    },
    {
      path: "/feedback/add",
      name: "FeedbackAdd",
      component: () => import("@/views/feedback/add.vue"),
      meta: {
        title: "提交反馈",
        showLink: false
      }
    },
    {
      path: "/feedback/detail/:id",
      name: "FeedbackDetail",
      component: () => import("@/views/feedback/detail.vue"),
      meta: {
        title: "反馈详情",
        showLink: false
      }
    }
  ]
};
