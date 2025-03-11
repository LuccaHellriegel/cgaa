import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost",
  pretendToBeVisual: true,
});

Object.defineProperty(global, "window", {
  value: dom.window,
  writable: true,
});

Object.defineProperty(global, "document", {
  value: dom.window.document,
  writable: true,
});

Object.defineProperty(global, "HTMLElement", {
  value: dom.window.HTMLElement,
  writable: true,
});

Object.defineProperty(global, "HTMLCanvasElement", {
  value: dom.window.HTMLCanvasElement,
  writable: true,
});

Object.defineProperty(global, "Image", {
  value: dom.window.Image,
  writable: true,
});

Object.defineProperty(global, "Audio", {
  value: dom.window.Audio,
  writable: true,
});

Object.defineProperty(global, "HTMLAudioElement", {
  value: dom.window.HTMLAudioElement,
  writable: true,
});

Object.defineProperty(global, "navigator", {
  value: dom.window.navigator,
  writable: true,
});

Object.defineProperty(global, "requestAnimationFrame", {
  value: (callback: FrameRequestCallback) => setTimeout(callback, 0),
  writable: true,
});

Object.defineProperty(global, "cancelAnimationFrame", {
  value: (id: number) => clearTimeout(id),
  writable: true,
});
