<template>
    <GameDisplayer :buttons="getButtons()"></GameDisplayer>
</template>

<script>
import Vue from 'vue'
import GameDisplayer from "@/components/GameDisplayer";
import { MakeBuyButtons, Button, MakePlaceButton, MakeBlockButtons, MODE_SHOP } from '@/common';

export default {
    name: "ReplaceDisplayer",
    components: {
        GameDisplayer,
    },
    created() {
        this.$store.state.display = {
            title: this.$data.title,
            message: this.$data.msg
        }
    },
    props: [
        'fields'
    ],
    data() {
        return {
            title: "하수인 배치",
            msg: "하수인을 어디에 배치하시겠습니까?",
        };
    },
    methods: {
        getButtons() {
            const back = new Button({
                text: '뒤로가기',
                cb: () => { this.$store.state.gameMode = MODE_SHOP; },
                color: 'blue',
                cols: 1,
            });

            const from = this.$store.state.replace.fromIDX;
            const isSummon = this.$store.state.replace.isSummon;

            const cb = idx => {
                if (isSummon) {
                    Vue.$socket.emit('summon', {
                        handidx: from,
                        fieldidx: idx,
                    });
                } else {
                    Vue.$socket.emit('replace', {
                        from: from,
                        to: idx,
                    });
                }
            };
            const buttons = MakeBlockButtons(this.fields);
            for (let i = 0, max = buttons.length; i <= max; i++) {
                buttons.splice(i * 2, 0, MakePlaceButton(cb, i));
            }

            return [back, ...buttons];
        }
    }
}
</script>

<style>

</style>