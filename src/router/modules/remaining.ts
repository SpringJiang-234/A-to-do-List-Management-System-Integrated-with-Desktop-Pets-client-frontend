const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
      showLink: false
    }
  },
  // 全屏403（无权访问）页面
  {
    path: "/access-denied",
    name: "AccessDenied",
    component: () => import("@/views/error/403.vue"),
    meta: {
      title: "403",
      showLink: false
    }
  },
  // 全屏500（服务器出错）页面
  {
    path: "/server-error",
    name: "ServerError",
    component: () => import("@/views/error/500.vue"),
    meta: {
      title: "500",
      showLink: false
    }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: {
      title: "加载中...",
      showLink: false
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  },
  // 透明窗口（桌宠）
  {
    path: "/new-windows",
    name: "DesktopPetWindow",
    component: () => import("@/views/new-windows/desktoppet-window.vue"),
    meta: {
      title: "桌宠窗口",
      showLink: false
    }
  },
  // 复合计时器窗口
  {
    path: "/compound-timer",
    name: "CompoundTimer",
    component: () => import("@/views/new-windows/compound-timer.vue"),
    meta: {
      title: "复合计时器",
      showLink: false
    }
  }
] satisfies Array<RouteConfigsTable>;
