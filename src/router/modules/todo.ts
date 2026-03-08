import RiTodoFill from '~icons/ri/todo-fill';

export default {
  path: "/todo",
  redirect: "/todo/index",
  meta: {
    icon: RiTodoFill,
    title: "待办",
    rank: 1
  },
  children: [
    {
      path: "/todo/index",
      name: "Todo",
      component: () => import("@/views/todo/index.vue"),
      meta: {
        title: "待办"
      }
    },
    {
      path: "/todo/detail/:id?",
      name: "TodoDetail",
      component: () => import("@/views/todo/detail.vue"),
      meta: {
        title: "待办详情"
      }
    }
  ]
};
