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
    }
  ]
};
