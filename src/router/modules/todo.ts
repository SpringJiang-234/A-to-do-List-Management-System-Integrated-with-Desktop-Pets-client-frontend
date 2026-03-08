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
      path: "/todo/add",
      name: "TodoAdd",
      component: () => import("@/views/todo/add.vue"),
      meta: {
        title: "添加待办",
        showLink: false
      }
    },
    {
      path: "/todo/detail/:id?",
      name: "TodoDetail",
      component: () => import("@/views/todo/detail.vue"),
      meta: {
        title: "待办详情",
        showLink: false
      }
    },
    {
      path: "/todo/edit/:id?",
      name: "TodoEdit",
      component: () => import("@/views/todo/edit.vue"),
      meta: {
        title: "修改待办",
        showLink: false
      }
    }
  ]
} satisfies RouteConfigsTable;
