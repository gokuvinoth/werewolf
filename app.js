(function() {
  var playerList = [];

  var players = {
    init: function() {
      playerList.push('computer 1');
      playerList.push('computer 2');
      this.getDOMObjects();
      this.bindDOM();
      this.renderPlayers();
    },
    getDOMObjects: function() {
      this.playerBar = document.querySelector('.bar');
      this.addPlayer = this.playerBar.querySelector('#add');
      this.startGame = this.playerBar.querySelector('#start');
      this.inputPlayer = this.playerBar.querySelector('#inputPlayer');
      this.players = this.playerBar.querySelector('.players');
      this.player = this.playerBar.querySelector('.player');
      this.playerElements = this.player.querySelectorAll('li > span');
      this.playerTemplate = this.playerBar.querySelector(
        '#player-template'
      ).innerHTML;
    },
    renderPlayers: function() {
      this.player.innerHTML = playerList
        .map((player, index) => {
          return this.playerTemplate
            .replace(/{{index}}/gi, index)
            .replace(/{{player}}/gi, player);
        })
        .join('');
      this.bindPlayers();
    },
    bindPlayers: function() {
      this.player.querySelectorAll('li > span').forEach(player => {
        player.addEventListener('click', this.removePlayer.bind(this));
      });
    },
    bindDOM: function() {
      this.addPlayer.addEventListener('click', this.addPlayerToList.bind(this));
      this.inputPlayer.addEventListener('input', () => {
        this.playerName = this.inputPlayer.value;
      });
      this.startGame.addEventListener('click', game.start.bind(game));
    },
    addPlayerToList: function() {
      if (this.playerName && !playerList.includes(this.playerName))
        playerList.push(this.playerName);
      this.inputPlayer.value = '';
      this.inputPlayer.focus();
      this.renderPlayers();
    },
    removePlayer: function(e) {
      playerList.splice(e.target.dataset.listid, 1);
      this.renderPlayers();
    }
  };
  var game = {
    init: function(e) {
      this.startButton = e.srcElement;
      this.gameArea = document.querySelector('.game');
      this.animateArea = document.querySelector('.xoom');
      this.gamePlayers = this.gameArea.querySelector('.gamePlayers');
      this.gametext = this.gameArea.querySelector('.game-text');
      this.gamePlayerTemplate = this.gameArea.querySelector(
        '#game-player-template'
      ).innerHTML;
      this.numberOfPlayers = playerList.length;
      this.specialCharecters = [
        'theif',
        'herbalist',
        'Cupid',
        'Seer',
        'vigilante',
        'littleGirl'
      ];
      this.numberOfWerewolves = Math.floor(this.numberOfPlayers / 3);
      this.numberOfWerewolves =
        this.numberOfWerewolves > 4 ? 4 : this.numberOfWerewolves;
      this.numberOfSuperVillagers = Math.floor(
        (this.numberOfPlayers - this.numberOfWerewolves) / 2
      );

      this.numberOfSuperVillagers =
        this.numberOfSuperVillagers > this.specialCharecters.length - 1
          ? this.specialCharecters.length - 1
          : this.numberOfSuperVillagers;
      this.numberOfVillagers =
        this.numberOfPlayers -
        this.numberOfWerewolves -
        this.numberOfSuperVillagers;
    },
    start: function(e) {
      this.init(e);
      this.assignCharecters();
      this.renderGame();
    },
    assignCharecters: function() {
      this.playersList = this.shuffle(playerList);
      this.specialCharecters = this.shuffle(this.specialCharecters);
      this.roleList = [];
      for (var i = 1; i <= this.numberOfVillagers; i++) {
        this.roleList.push(`Villager_${i % 6 === 0 ? 6 : i % 6}`);
      }
      for (var i = 1; i <= this.numberOfWerewolves; i++) {
        if (i === 4) this.roleList.push('Alpha WereWolf');
        else this.roleList.push(`WereWolf_${i % 3 === 0 ? 3 : i % 3}`);
      }
      for (var i = 1; i <= this.numberOfSuperVillagers; i++) {
        this.roleList.push(this.specialCharecters[i]);
      }
      this.playerWithRoles = {};
      this.playersList.forEach(
        (player, index) => (this.playerWithRoles[player] = this.roleList[index])
      );
    },
    shuffle: function(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    renderGame: function() {
      this.finalHtmlContent = '';
      if (this.numberOfPlayers < 3)
        this.gametext.innerHTML = `Less players game cannot be played with only ${
          this.numberOfPlayers
        } players , we need minium 3 players.`;
      else {
        this.gametext.innerHTML = `Lets Begin.
            Villagers : ${this.numberOfVillagers}
            Werewolves : ${this.numberOfWerewolves}
            Special Charecters : ${this.numberOfSuperVillagers}
            `;
        this.animate();
        Object.keys(this.playerWithRoles).forEach((player, index) => {
          this.finalHtmlContent += this.gamePlayerTemplate
            .replace(/{{gamePlayer}}/gi, player)
            .replace(/{{gamePlayerId}}/gi, index)
            .replace(/{{role}}/gi, this.playerWithRoles[player])
            .replace(/{{roleId}}/gi, index);
        });
      }
      this.gamePlayers.innerHTML = this.finalHtmlContent;
    },
    animate: function() {
      if (!this.startButton.classList.contains('hidden'))
        this.startButton.classList.toggle('hidden');
      if (this.animateArea.classList.contains('hidden'))
        this.animateArea.classList.toggle('hidden');
      if (!this.gamePlayers.classList.contains('hidden'))
        this.gamePlayers.classList.toggle('hidden');

      let i = 0;
      let timerId = setInterval(() => {
        // el.style.webkitTransform = `rotate(${i++}deg)`;
        i++;
        if (i < 6) {
          this.animateArea.classList.toggle('xoom_animate');
          this.animateArea.classList.toggle('xoom');
        }
        if (i === 7) {
          clearInterval(timerId);
        }
        if (i === 6) {
          this.animateArea.classList.toggle('hidden');
          this.animateArea.classList.toggle('xoom_animate');
          this.animateArea.classList.toggle('xoom');
          this.gamePlayers.classList.toggle('hidden');
          this.startButton.classList.toggle('hidden');
        }
      }, 2000);
    }
  };

  players.init();
})();
