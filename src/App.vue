<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h1>ProjectHS</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/gze1206"
        target="_blank"
        text
      >
        <span class="mr-2">goto Github</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
});
</script>
