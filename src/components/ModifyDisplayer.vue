<template>
    <GameDisplayer :buttons="getButtons()"></GameDisplayer>
</template>

<script>
import Vue from 'vue'
import GameDisplayer from "@/components/GameDisplayer";
import { Button, MODE_REPLACE, MODE_SHOP } from '@/common';

export default {
    name: "ModifyDisplayer",
    components: {
        GameDisplayer,
    },
    created() {
        this.updateDisplay();
    },
    data() {
        return {
            title: "",
            msg: "",
        };
    },
    props: [
        'fields',
    ],
    methods: {
        updateDisplay() {
            this.$store.state.display = {
                title: this.$data.title,
                message: this.$data.msg
            }
        },
        getButtons() {
            const idx = this.$store.state.modify.idx;
            const card = this.$store.state.modify.card;

            this.$data.title = card.name;
            this.$data.msg = card.info.replace(/\n/gi, '<br/>');
            this.updateDisplay();

            const back = new Button({
                text: '뒤로가기',
                cb: () => { this.$store.state.gameMode = MODE_SHOP; },
                color: 'blue',
                cols: 1,
            });

            const fire = new Button({
                text: '해고',
                cb: () => { Vue.$socket.emit('sell', { idx: idx }); },
                color: 'red',
            });

            const replace = new Button({
                text: '재배치',
                cb: () => {
                    if (this.fields.length < 2) {
                        return;
                    }

                    this.fields.splice(idx, 1);
                    this.$store.state.replace = {
                        fromIDX: idx,
                        isSummon: false,
                    };
                    this.$store.state.gameMode = MODE_REPLACE;
                },
                color: this.fields.length < 2 ? 'black' : 'green',
            });

            return [back, fire, replace];
        }
    }
}
</script>

<style>

</style>