import { defineStore } from 'pinia'

export const useMyAppDataStore = defineStore('myAppDataStore',{

  state: () => ({
    selectedNode: null,
    // isHiddenNav: true,
    isHiddenCombineNav: true,
   }),
  actions: {}
})
