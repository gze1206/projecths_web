<template>
    <div class="home">
        <v-card class="status">
            <v-card-title>{{$store.state.display.title}}</v-card-title>
            <v-card-text v-html="$store.state.display.message"></v-card-text>
        </v-card>

        <v-container>
            <v-row class="choices">
                <v-col v-for="(btn, idx) in buttons" :key="idx" :cols="btn.cols">
                    <v-btn dark
                        @click="btn.cb()"
                        v-html="btn.text"
                        :color="btn.color"
                        style="width: fit-content; height: 100%;">
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
  </div>
</template>

<script>
export default {
    name: "GameDisplayer",
    props: [
        'buttons',
    ]
}
</script>

<style>
    .status {
        margin-top: 1em;
    }
    .choices {
        margin: 1.5em;
        width: 100%;
        height: 450px;
        overflow: scroll;
    }

    .choices > .col {
        max-width: 100%!important;
        width: fit-content!important;
        flex: 0 0 0;
    }
</style>