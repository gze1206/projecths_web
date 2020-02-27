<template>
    <div id="home">
        <v-card flat>
            <v-card-title>Hello, {{username}}</v-card-title>
            <v-card-subtitle>
                {{getHeroName()}}<br/>
                남은 체력 : {{getHeroHP()}}<br/>
                GOLD : {{getGoldText()}}
            </v-card-subtitle>
            <v-card-text>
                고용 비용 : {{getBuyPrice()}}
                <br/>
                해고 시 환급 골드 : {{getSellPrice()}}
            </v-card-text>
        </v-card>

        <ShopDisplayer v-if="getMode() === 'SHOP'" :shopCards="shopCards" :sells="fields" :hands="hands" :heroPower="heroPower" />
        <ReplaceDisplayer v-else-if="getMode() === 'REPLACE'" :fields="fields" />
        <ModifyDisplayer v-else-if="getMode() === 'MODIFY'" :fields="fields" />
        <BattleDisplayer v-else-if="getMode() === 'BATTLE'" />

        <v-overlay :value="getLoading()">
            <h1>WAIT FOR READY OTHER PLAYER</h1>
        </v-overlay>
    </div>
</template>

<script>
import Vue from 'vue'
import Cookies from 'js-cookie';
import ShopDisplayer from '@/components/ShopDisplayer';
import ReplaceDisplayer from '@/components/ReplaceDisplayer';
import ModifyDisplayer from '@/components/ModifyDisplayer';
import BattleDisplayer from '@/components/BattleDisplayer';
import { MODE_SHOP, MODE_BATTLE, GetDamageType, ScrollToEnd } from '../common';

export default {
    name: 'Home',
    components: {
        ShopDisplayer,
        ReplaceDisplayer,
        ModifyDisplayer,
        BattleDisplayer,
    },
    created() {
        Vue.$socket.on('readied', console.log);
        Vue.$socket.on('openshop', data => this.drawShop(data));
        Vue.$socket.on('freeze', data => {
            if (data.success === false) {
                this.$store.state.display.message = "빙결 비용이 부족합니다!";
                return;
            }
            this.drawShop(data);
            this.$store.state.display.message = "빙결 상태인 하수인은 다음 턴이 되어도 사라지지 않습니다!"
        });
        Vue.$socket.on('reroll', data => {
            if (data.success === false) {
                this.$store.state.display.message = "새로고침 비용이 부족합니다!";
                return;
            }
            this.drawShop(data);
            this.$store.state.display.message = "새로고침은 돈만 충분하다면 원하는 하수인이 나올 때까지 반복할 수 있습니다!"
        });
        Vue.$socket.on('buy', data => {
            if (data.success === false) {
                this.$store.state.display.message = "고용 비용이 부족합니다!";
            }
        });
        Vue.$socket.on('hands', data => {
            this.$data.hands = data.hands;
        });
        Vue.$socket.on('fields', data => {
            this.$data.fields = data.fields;
        });
        Vue.$socket.on('upgrade', data => {
            if (data.success === false) {
                this.$store.state.display.message = "강화 비용이 부족합니다!";
                return;
            }
            this.$store.state.upgrade = {
                cost: data.cost,
                level: data.level,
            };
        });
        Vue.$socket.on('gold', data => {
            this.$store.state.gold = {
                max: data.max,
                cur: data.cur,
                prices: data.prices,
            };
        });
        Vue.$socket.on('made', data => {
            if (data.name) {
                this.$store.state.display.message = `${data.name} 님이 황금 하수인을 완성했습니다!`;
            }
        });
        Vue.$socket.on('begin', data => {
            console.log('begin', data);
        });
        Vue.$socket.on('battle', data => {
            this.$store.state.gameMode = MODE_BATTLE;
            if (data.phase === 'begin') {
                this.$store.state.battleIsDone = false;
                this.$store.state.isWaiting = false;
            }
            if (data.phase === 'end') {
                this.$store.state.battleIsDone = true;
                ScrollToEnd();
                if (data.name == null) {
                    this.$store.state.display.message += `<br/><br/>이번 전투는 무승부였습니다!`;
                    return;
                }
                this.$store.state.display.message += `<br/><br/>이번 전투에서 ${data.name} 님이 승리하셨습니다!`;
                return;
            }
            if (data.phase === 'attack') {
                this.$store.state.display.message += `<br/><br/>${data.atkOwner} 님의 ${data.atk}이(가) ${data.targetOwner} 님의 ${data.target}을(를) 공격합니다!`;
                return;
            }
            if (data.phase === 'damaged') {
                this.$store.state.display.message += `<br/>${data.atkOwner} 님의 ${data.atk}이(가) ${data.targetOwner} 님의 ${data.target}에게 ${GetDamageType(data.type)}(으)로 ${data.dmg}의 피해를 주었습니다.`;
                return;
            }
            if (data.phase === 'guard') {
                this.$store.state.display.message += `<br/>${data.targetOwner} 님의 ${data.target}이(가) 천상의 보호막으로 ${data.atkOwner} 님의 ${data.atk}이(가) ${GetDamageType(data.type)}(으)로 가한 ${data.dmg}의 피해를 방어했습니다.`;
                return;
            }
            if (data.phase === 'dead') {
                this.$store.state.display.message += `<br/>${data.owner} 님의 ${data.entity}이(가) 죽었습니다.`;
                return;
            }
            if (data.phase === 'hero_damaged') {
                this.$store.state.display.message += `<br/>${data.atk} 님이 ${data.target} 님에게 ${data.dmg}의 피해를 주었습니다!`;
                return;
            }
        });
        Vue.$socket.on('power', data => {
            if (data.success === false) {
                this.$store.state.display.message = "영웅 능력을 사용할 비용이 부족합니다!";
                return;
            }
        });
        Vue.$socket.on('hero', data => {
            this.$store.state.hero = data.hero;
            this.$data.heroPower = data.power;
        });
        Vue.$socket.on('gameover', data => {
            if (Vue.$socket.id === data.id) {
                this.$store.state.gameover = true;
                this.$store.state.display.message = `<h1><b>게임 종료!<br/>순위 : ${data.rank}위</b></h1><br/>${this.$store.state.display.message}`;
                setTimeout(() => ScrollToEnd(), 3000);
            }
            return;
        });

        Vue.$socket.emit('ready', { HERO: 0 });

        this.username = this.getName;
    },
    data() {
        return {
            username: '',
            shopCards: [],
            fields: [],
            hands: [],
            heroPower: {},
        };
    },
    computed: {
        getName() {
            return Cookies.get('username');
        }
    },
    methods: {
        getMode() {
            return this.$store.state.gameMode;
        },
        drawShop(data) {
            this.$store.state.gameover = '';
            this.$store.state.isWaiting = false;
            this.$store.state.gameMode = MODE_SHOP;
            this.$store.state.replace = {
                fromIDX: -1,
                isSummon: false,
            };
            // console.log(data);
            this.shopCards = data.cards;
        },
        getGoldText() {
            const gold = this.$store.state.gold;
            return `${gold.cur} / ${gold.max}`;
        },
        getBuyPrice() {
            return this.$store.state.gold.prices.buy;
        },
        getSellPrice() {
            return this.$store.state.gold.prices.sell;
        },
        getHeroName() {
            return this.$store.state.hero.name;
        },
        getHeroHP() {
            return this.$store.state.hero.hp;
        },
        getLoading() {
            return this.$store.state.isWaiting;
        }
    }
};
</script>
