import { defineStore } from "pinia";
import { store } from "../utils";

export interface TodoFilter {
  categories: string[];
  tags: string[];
  timeRule: string;
}

export const useTodoStore = defineStore("pure-todo", {
  state: () => ({
    filter: {
      categories: [],
      tags: [],
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
