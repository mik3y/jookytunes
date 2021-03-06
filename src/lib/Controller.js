import Storage from "./Storage";
import Playlist from "./Playlist";

const State = Object.freeze({
  INIT: Symbol("INIT"),
  IDLE: Symbol("IDLE"),
  PLAYING: Symbol("PLAYING"),
  PAUSED: Symbol("PAUSED"),
});

/**
 * Composes a `Playlist`, `Storage`, and maybe other stuff someday.
 */
class Controller {
  constructor(options = { onStateChange: () => {} }) {
    this.storage = new Storage();
    this.playlist = new Playlist({});
    this.state = State.INIT;
    this.onStateChange = options.onStateChange;
    this.currentTrack = null;
    this.queue = [];
    this.initialize();
  }

  initialize() {
    this.playlist.onStatusChanged = ({ isPlaying, currentTrack, queue }) => {
      if (!isPlaying && this.state !== State.PAUSED) {
        this.state = State.PAUSED;
      } else if (isPlaying && this.state !== State.PLAYING) {
        this.state = State.PLAYING;
      }

      if (currentTrack !== this.currentTrack) {
        this.currentTrack = currentTrack;
      }
  
      this.queue = queue;
      this.publishStateChange();
    };
    this.storage.initialize();
  }

  publishStateChange() {
    const newState = {
      isPlaying: this.state === State.PLAYING,
      currentTrack: this.currentTrack,
      queue: this.queue,
    };
    this.onStateChange(newState);
  }

  async addTrack(t, addToStorage = true) {
    if (addToStorage) {
      await this.storage.addTrackToLibrary(t);
    }
    this.playlist.addTrack(t);
  }

  async loadTrackData(track) {
    const cachedData = track.getCachedData();
    if (cachedData) {
      return cachedData;
    }
    const trackData = await this.storage.loadTrackData(track.digest);
    return trackData;
  }

  play() {
    this.playlist.play();
  }

  stop() {
    this.playlist.stop();
  }

  advance() {
    this.playlist.advance();
  }

}

export default Controller;
