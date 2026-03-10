import { defineStore } from "pinia";
import { store } from "../utils";

export interface TodoFilter {
  title: string;
  content: string;
  categories: string[];
  tags: string[];
  priorities: string[];
  isContinuous: string[];
  time: string;
  startDate: string;
  endDate: string;
  status: string[];
  isTop: string[];
  timeRule: string;
}

export const useTodoStore = defineStore("pure-todo", {
  state: () => ({
    filter: {
      title: "",
      content: "",
      categories: [],
      tags: [],
      priorities: [],
      isContinuous: [],
      time: "",
      startDate: "",
      endDate: "",
      status: [],
      isTop: [],
      timeRule: ""
    } as TodoFilter
  }),
  actions: {
    setFilter(filter: TodoFilter) {
      this.filter = filter;
    }
  }
});

export function useTodoStoreHook() {
  return useTodoStore(store);
}
