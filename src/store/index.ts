import Vue from 'vue'
import Vuex from 'vuex'
import { MODE_UNKNOWN } from '../common';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    gameMode: MODE_UNKNOWN,
    hero: {
      hp: 0,
    },
    battleIsDone: false,
    isWaiting: false,
    gameover: false,
    gold: {
      max: 0,
      cur: 0,
      prices: {
        buy: 0,
        sell: 0,
        refresh: 0,
        freeze: 0,
      },
    },
    upgrade: {
      cost: 0,
      level: 0,
    },
    modify: {
      idx: -1,
      card: {
        name: '',
        info: ''
      },
    },
    replace: {
      fromIDX: -1,
      isSummon: false,
    },
    display: {
      title: "",
      message: "",
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
})
