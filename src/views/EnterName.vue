<template>
    <v-container>
        <v-row>
            <v-col cols="12" align="center">
                <v-text-field label="user name" v-model="name">
                </v-text-field>
            </v-col>
        </v-row>
        <v-row>
            {{getName()}}
        </v-row>
        <v-row>
            <v-btn @click="setName()">
                Request match
            </v-btn>
        </v-row>

        <v-overlay :value="loading">
            <h1>MATCHING...</h1>
        </v-overlay>
    </v-container>
</template>

<script>
import Vue from 'vue'
import Cookies from 'js-cookie';
import * as conf from '@/../config.js';

export default {
    data() {
        return {
            name: '',
            loading: false,
        };
    },
    created() {
        console.log(this);
        Vue.$socket.on('matched', () => {
            this.$router.push('/');
        });
    },
    methods: {
        setName() {
            this.$data.name = this.$data.name || 'guest';
            this.$data.loading = true;
            const expires = new Date();
            const duration = conf.isDev ? 30 : 180;
            expires.setSeconds(expires.getSeconds() + duration);

            Cookies.set('username', this.$data.name, { expires: expires });
            Vue.$socket.emit('match', {
                name: this.$data.name
            });
        },
        getName() {
            return Cookies.get('username');
        }
    }
}
</script>

<style>

</style>