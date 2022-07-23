<template>
  <div>
    <div>
      <h3>Welcome to the Magic Game!</h3>
    </div>
    <div class="game-container">
      <ion-phaser
          v-bind:game.prop="game"
          v-bind:initialize.prop="true"
      />
    </div>
    <div>
      Current score: {{ starsCollected }}
    </div>
  </div>
</template>

<script>

import Phaser from "phaser";
import PlayScene from "@/game/scenes/PlayScene";

export default {
  name: "Game",
  data() {
    return {
      starsCollected: 0,
      game: {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: {y: 300},
            debug: false
          }
        },
        scene: [PlayScene]
      }
    }
  },
  methods: {},
  watch: {
    '$store.state.count': function (newValue) {
      this.starsCollected = newValue;
      if (newValue >= 5) {
        alert("Congratulation! \nYou Win!)");
        window.location.reload();
      }
    }
  }
}
</script>
