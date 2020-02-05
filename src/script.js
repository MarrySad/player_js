import { ICONS } from "./icons.js";

function getPlayer() {
  const player = new Player(event.target.id);
  player.init();
}

class Player {
  constructor(id) {
    this.nodes = {
      trackName: document.createElement("div"),
      playBtn: document.createElement("div"),
      currentTime: document.createElement("div"),
      progressbar: document.createElement("div"),
      time_duration: document.createElement("div"),
      speed: document.createElement("select"),
      volume: document.createElement("div"),
      download: document.createElement("a"),
      upload: document.createElement("div")
    };
    this.subnodes = {
      progressbar__current: document.createElement("div"),
      volume__label: document.createElement("label"),
      volume__input_wrap: document.createElement("div"),
      volume__input: document.createElement("input")
    };
    this.entryEl = document.querySelector(`#${id}`);
    this.audio = new Audio(this.entryEl.getAttribute("src"));
    this.trackName = this.entryEl.innerText;
    this.duration = 0;
    this.currentTime = 0;
    this.playing = false;
    this.timer = null;
    this.speed = 1;
    this.volume = 1;
  }

  play() {
    if (this.playing) {
      this.audio.pause();
      this.playing = !this.playing;
      this.nodes.playBtn.innerHTML = ICONS.play;
      clearInterval(this.timer);
    } else {
      this.audio.play();
      this.playing = !this.playing;
      this.nodes.playBtn.innerHTML = ICONS.pause;
    }
  }

  setCurrentTime() {
    this.currentTime = this.audio.currentTime;
    this.nodes.currentTime.textContent = timeParser(this.currentTime);
  }

  setProgressbar() {
    this.subnodes.progressbar__current.style.width = `${(this.currentTime /
      this.duration) *
      100}%`;
  }

  setCurrentTimeByClick(event) {
    const elX = event.target.getBoundingClientRect().x;
    const newProgress =
      (event.clientX - elX) / this.nodes.progressbar.offsetWidth;
    this.audio.currentTime = this.duration * newProgress;
    this.setCurrentTime();
    this.setProgressbar();
  }

  setSpeed() {
    this.audio.playbackRate = this.nodes.speed.value;
  }

  setVolume() {
    this.audio.volume = this.subnodes.volume__input.value / 100;
  }

  uploadAudio() {
    alert("Возможно..");
  }

  init() {
    this.entryEl.className = "player";
    this.entryEl.setAttribute("onClick", "");
    this.entryEl.innerHTML = "";
    this.entryEl.append(this.audio);

    this.audio.addEventListener("loadedmetadata", () => {
      this.duration = this.audio.duration;
      this.nodes.time_duration.textContent = timeParser(this.duration);
    });
    this.audio.addEventListener(
      "play",
      () =>
        (this.timer = setInterval(() => {
          this.setCurrentTime();
          this.setProgressbar();
        }, 500))
    );

    Object.assign(this.nodes.trackName, {
      className: "track_name",
      textContent: this.trackName
    });
    Object.assign(this.nodes.playBtn, {
      className: "button_play",
      innerHTML: ICONS.play,
      onclick: this.play.bind(this)
    });
    Object.assign(this.nodes.currentTime, {
      className: "time_current",
      textContent: "0:00"
    });
    Object.assign(this.nodes.progressbar, {
      className: "progressbar",
      onclick: this.setCurrentTimeByClick.bind(this)
    });
    Object.assign(this.subnodes.progressbar__current, {
      className: "progressbar__current"
    });
    Object.assign(this.nodes.time_duration, {
      className: "time_duration",
      textContent: this.timeDuration
    });
    Object.assign(this.nodes.speed, {
      className: "speed",
      onchange: this.setSpeed.bind(this),
      innerHTML: `<option value="0.5">x0.5</option>
      <option value="1" selected>x1</option>
      <option value="1.25">x1.25</option>
      <option value="1,5">x1.5</option>
      <option value="1.75">x1.75</option>
      <option value="2">x2</option>
      <option value="2.5">x2.5</option>`
    });
    Object.assign(this.nodes.volume, {
      className: "volume"
    });
    Object.assign(this.subnodes.volume__label, {
      className: "volume__label",
      innerHTML: ICONS.volume,
      for: "volume__input"
    });
    Object.assign(this.subnodes.volume__input, {
      className: "volume__input",
      type: "range",
      id: "volume__input",
      value: "50",
      min: "0",
      max: "100",
      oninput: this.setVolume.bind(this)
    });
    Object.assign(this.subnodes.volume__input_wrap, {
      className: "volume__input_wrap"
    });
    Object.assign(this.nodes.download, {
      className: "download",
      innerHTML: ICONS.download,
      href: this.audio.src,
      download: this.trackName
    });
    Object.assign(this.nodes.upload, {
      className: "upload",
      innerHTML: ICONS.upload,
      onclick: this.uploadAudio.bind(this)
    });

    this.nodes.progressbar.append(this.subnodes.progressbar__current);
    this.nodes.volume.append(this.subnodes.volume__label);
    this.nodes.volume.append(this.subnodes.volume__input_wrap);
    this.subnodes.volume__input_wrap.append(this.subnodes.volume__input);

    for (let el in this.nodes) {
      this.entryEl.append(this.nodes[el]);
    }
  }
}

function timeParser(time) {
  return [
    Math.floor(time / 60),
    Math.floor(time % 60)
      .toString()
      .padStart(2, "0")
  ].join(":");
}

const audios = document.querySelectorAll(".audio");
audios.forEach(el => {
  el.onclick = getPlayer;
});
