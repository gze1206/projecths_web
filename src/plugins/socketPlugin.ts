import Vue, { PluginObject } from 'vue';
import io from 'socket.io-client';

import * as conf from "../../config.js";

declare module 'vue/types/vue' {
    interface VueConstructor {
        $socket: SocketIOClient.Socket;
    }
}

const socket = io(conf.gameserver);

const SocketPlugin: PluginObject<SocketIOClient.Socket> = {
    install(vue) {
        vue.$socket = socket;
    }
};

Vue.use(SocketPlugin);