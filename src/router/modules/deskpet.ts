import StreamlineFlexPetPawSolid from '~icons/streamline-flex/pet-paw-solid';

export default {
  path: "/deskpet",
  redirect: "/deskpet/index",
  meta: {
    icon: StreamlineFlexPetPawSolid,
    title: "我的桌宠",
    rank: 9
  },
  children: [
    {
      path: "/deskpet/index",
      name: "DeskPet",
      component: () => import("@/views/deskpet/index.vue"),
      meta: {
        title: "我的桌宠"
      }
    }
  ]
};
