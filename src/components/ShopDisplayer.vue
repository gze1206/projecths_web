<template>
    <GameDisplayer :buttons="getButtons()"></GameDisplayer>
</template>

<script>
import Vue from 'vue'
import GameDisplayer from "@/components/GameDisplayer";
import { MakeBuyButtons, Button, MakeModifyButtons, MakeSummonButtons, MODE_REPLACE, MODE_MODIFY, MakeHeroPowerButton } from '@/common';

export default {
    name: "ShopDisplayer",
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
        'shopCards', 'sells', 'hands', 'heroPower'
    ],
    data() {
        return {
            title: "하수인 고용",
            msg: "고용할 하수인을 선택해주세요.<br/>또는 고용한 하수인을 해고하거나, 손에 있는 카드를 낼 수 있습니다.",
        };
    },
    methods: {
        getButtons() {
            // console.log('draw');
            const buy = MakeBuyButtons(this.shopCards, idx => {
                Vue.$socket.emit('buy', { idx: idx });
            });
            const sell = MakeModifyButtons(this.sells, (idx, card) => {
                this.$store.state.modify = {
                    idx: idx,
                    card: {
                        name: card.name,
                        info: card.info,
                    },
                };
                this.$store.state.gameMode = MODE_MODIFY;
            });
            const hand = MakeSummonButtons(this.hands, idx => {
                this.$store.state.replace = {
                    fromIDX: idx,
                    isSummon: true,
                };
                this.$store.state.gameMode = MODE_REPLACE;
            });

            const upgrade = this.$store.state.upgrade;
            const upgradable = upgrade.cost >= 0;
            const upgradeText = upgradable
                ? `선술집 강화\n현재 : ${upgrade.level}단계\n비용 : ${upgrade.cost}`
                : `선술집 강화\n현재 : ${upgrade.level}단계\n이미 최대 단계입니다!`;
            const rankup = new Button({
                text: upgradeText.replace(/\n/gi, '<br/>'),
                cb: () => {
                    if (upgradable) {
                        Vue.$socket.emit('upgrade')
                    }
                },
                color: upgradable ? 'blue' : 'black',
                cols: upgradable ? 1 : 2,
            });

            const freeze = new Button({
                text: `빙결<br/>비용 : ${this.$store.state.gold.prices.freeze}`,
                cb: () => Vue.$socket.emit('freeze'),
                color: 'blue',
                cols: 1,
            });
            const reroll = new Button({
                text: `새로고침<br/>비용 : ${this.$store.state.gold.prices.refresh}`,
                cb: () => Vue.$socket.emit('reroll'),
                color: 'blue',
                cols: 1,
            });
            const power = MakeHeroPowerButton(this.heroPower, () => {
                Vue.$socket.emit('power');
            });
            const skip = new Button({
                text: '준비 완료',
                cb: () => {
                    this.$store.state.isWaiting = true;
                    Vue.$socket.emit('skipshop');
                },
                color: 'blue',
            });

            return [rankup, freeze, reroll, power, skip, ...buy, ...sell, ...hand];
        }
    }
}
</script>

<style>

</style>