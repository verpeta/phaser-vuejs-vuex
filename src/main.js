import { createApp } from 'vue'
import App from './App.vue'
import { defineCustomElements as defineIonPhaser } from '@ion-phaser/core/loader'
import store from "@/store";


defineIonPhaser(window);


const app = createApp(App);

app.use(store)
    .mount('#app');

app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("ion-");


