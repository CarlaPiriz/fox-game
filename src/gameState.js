import {
  RAIN_CHANCE,
  SCENES,
  DAY,
  NIGHT,
  getNextHungerTime,
  getNextDieTime,
  getNextPoopTime,
} from "./constants";
import { modFox, modScene, togglePoopBag, writeModal } from "./ui";

const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1,
  sleepTime: -1,
  hungryTime: -1,
  dieTime: -1,
  timeToCelebrate: -1,
  stopCelebrating: -1,
  poopTime: -1,

  tick() {
    this.clock++;
    console.log("clock", this.clock, this.poopTime);
    if (this.clock === this.wakeTime) {
      this.wake();
    } else if (this.clock === this.sleepTime) {
      this.sleep();
    } else if (this.clock === this.hungryTime) {
      this.getHungry();
    } else if (this.clock === this.dieTime) {
      this.die();
    } else if (this.clock === this.timeToCelebrate) {
      this.startCelebrating();
    } else if (this.clock === this.stopCelebrating) {
      this.endCelebrating();
    } else if (this.clock === this.poopTime) {
      this.poop();
    }
    return this.clock;
  },
  startGame() {
    this.current = "HATCHING";
    this.wakeTime = this.clock + 2;
    modFox("egg");
    modScene("day");
    writeModal();
  },
  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    // Si math.random es mas grande que la chance de llover 0 es de dia, 1 de noche
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    this.sleepTime = this.clock + DAY;
    this.hungryTime = getNextHungerTime(this.clock);
    this.foxState();
  },
  sleep() {
    this.current = "SLEEP";
    modFox("sleep");
    modScene("night");
    this.clearTimes();
    this.wakeTime = this.clock + NIGHT;
  },
  getHungry() {
    this.current = "HUNGRY";
    this.dieTime = getNextDieTime(this.clock);
    this.hungryTime = -1;
    modFox("hungry");
  },
  die() {
    this.current = "DEAD";
    modFox("dead");
    modScene("dead");
    this.clearTimes();
    writeModal(
      "El zorro se murio porque no lo cuidaste bien <br> Press the middle button to start"
    );
  },
  startCelebrating() {
    this.current = "CELEBRATING";
    modFox("celebrate");
    this.timeToCelebrate = -1;
    this.stopCelebrating = this.clock + 2;
  },
  endCelebrating() {
    this.stopCelebrating = -1;
    this.current = "IDLING";
    this.foxState();
    togglePoopBag(false);
  },
  clearTimes() {
    this.wakeTime = -1;
    this.sleepTime = -1;
    this.hungryTime = -1;
    this.dieTime = -1;
    this.poopTime = -1;
    this.timeToCelebrate = -1;
    this.stopCelebrating = -1;
  },
  foxState() {
    if (this.current === "IDLING") {
      if (SCENES[this.scene] === "rain") {
        modFox("rain");
      } else {
        modFox("idling");
      }
    }
  },
  handleUserAction(icon) {
    if (
      ["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)
    ) {
      //Nada
      return;
    }
    if (["INIT", "DEAD"].includes(this.current)) {
      // Empieza el juego
      this.startGame();
      return;
    }

    switch (icon) {
      case "weather":
        this.changeWeather();
        break;
      case "poop":
        this.cleanUpPoop();
        break;
      case "fish":
        this.feed();
        break;
    }
  },
  changeWeather() {
    this.scene = (this.scene + 1) % SCENES.length;
    modScene(SCENES[this.scene]);
    this.foxState();
  },
  cleanUpPoop() {
    if (this.current != "POOPING") {
      return;
    }
    this.dieTime = -1;
    togglePoopBag(true);
    this.startCelebrating();
    this.hungryTime = getNextHungerTime(this.clock);
  },
  feed() {
    if (this.current != "HUNGRY") {
      return;
    }
    this.current = "FEEDING";
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    modFox("eating");
    this.timeToCelebrate = this.clock + 2;
  },
  poop() {
    this.current = "POOPING";
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox("pooping");
  },
};
export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
