import "./index.css";
import App from "./App.svelte";
import { mount } from "svelte";

const target = document.getElementById("app") || document.body;

let app;
try {
  // Svelte 5 mount
  app = mount(App, { target });
} catch (e) {
  // Svelte 4 / legacy fallback
  app = new App({ target });
}

export default app;
