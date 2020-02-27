<template>
    <GameDisplayer :buttons="getButtons()"/>
</template>

<script>
import Vue from 'vue'
import GameDisplayer from '@/components/GameDisplayer';
import { Button } from '@/common';

export default {
    name: "BattleDisplayer",
    components: {
        GameDisplayer,
    },
    created() {
        this.$store.state.display = {
            title: this.$data.title,
            message: this.$data.msg
        }
    },
    data() {
        return {
            title: "전투",
            msg: "하수인을 모두 잃은 플레이어가 패배합니다!",
        };
    },
    methods: {
        getButtons() {
            const gameover = this.$store.state.gameover || false;
            if (this.$store.state.battleIsDone || true === gameover) {
                const skip = new Button({
                    text: '다음 턴으로',
                    cb: () => {
                        if (true === gameover) {
                            Vue.$socket.removeAllListeners();
                            Vue.$socket.disconnect();
                            Vue.$socket.connect();
                            alert('게임 종료!');
                            this.$router.push('/entername');
                            return;
                        }
                        this.$store.state.isWaiting = true;
                        Vue.$socket.emit('skipbattle');
                    },
                    color: 'blue',
                });
                return [skip];
            }
            return []
        },
    }
}
</script>

<style>

</style>