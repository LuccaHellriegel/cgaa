import "./setupWindow";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { JSDOM } from "jsdom";

declare global {
  namespace NodeJS {
    interface Global {
      window: any;
      document: any;
      HTMLElement: any;
      HTMLCanvasElement: any;
      Image: any;
      Audio: any;
      HTMLAudioElement: any;
      navigator: any;
      requestAnimationFrame: (callback: FrameRequestCallback) => number;
      cancelAnimationFrame: (handle: number) => void;
    }
  }
}

// Set up a browser-like environment
const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost",
  pretendToBeVisual: true,
});

(global as any).window = dom.window;
(global as any).document = dom.window.document;
(global as any).HTMLElement = dom.window.HTMLElement;
(global as any).HTMLCanvasElement = dom.window.HTMLCanvasElement;
(global as any).Image = dom.window.Image;
(global as any).Audio = dom.window.Audio;
(global as any).HTMLAudioElement = dom.window.HTMLAudioElement;
(global as any).navigator = dom.window.navigator;

// Mock requestAnimationFrame
(global as any).requestAnimationFrame = (callback: FrameRequestCallback) =>
  setTimeout(callback, 0);
(global as any).cancelAnimationFrame = (id: number) => clearTimeout(id);

// Mock Phaser
vi.mock("phaser", () => {
  class MockScene {
    add: any;
    cameras: any;
    input: any;
    scene: any;
    load: any;
    physics: any;

    constructor(config: string | object) {
      let key = "";
      if (typeof config === "string") {
        key = config;
      } else if (typeof config === "object" && config !== null) {
        key = (config as any).key || "";
      }

      this.scene = {
        start: vi.fn(),
        settings: {
          key: key,
        },
      };

      this.add = {
        sprite: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          setScale: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
        }),
        image: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
          setScale: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
          setAlpha: vi.fn().mockReturnThis(),
        }),
        text: vi.fn().mockReturnValue({
          setOrigin: vi.fn().mockReturnThis(),
        }),
        rectangle: vi.fn().mockReturnValue({
          setStrokeStyle: vi.fn().mockReturnThis(),
        }),
      };
      this.cameras = {
        main: {
          setBackgroundColor: vi.fn(),
        },
      };
      this.input = {
        once: vi.fn(),
      };
      this.load = {
        on: vi.fn(),
        setPath: vi.fn(),
        image: vi.fn(),
      };
      this.physics = {
        add: {
          existing: vi.fn(),
        },
      };
    }

    init() {}
    preload() {}
    create() {}
    update() {}
  }

  return {
    Game: vi.fn().mockImplementation((config) => ({
      config,
      destroy: vi.fn(),
    })),
    Scene: MockScene,
    AUTO: "auto",
    Scale: {
      FIT: "fit",
      CENTER_BOTH: "resize",
    },
    GameObjects: {
      Sprite: vi.fn().mockImplementation(() => ({
        setOrigin: vi.fn().mockReturnThis(),
        setScale: vi.fn().mockReturnThis(),
        setDepth: vi.fn().mockReturnThis(),
      })),
      Image: vi.fn(),
      Text: vi.fn(),
    },
    Physics: {
      Arcade: {
        Sprite: vi.fn().mockImplementation(() => ({
          setVelocity: vi.fn().mockReturnThis(),
          setCollideWorldBounds: vi.fn().mockReturnThis(),
        })),
      },
    },
    Device: {
      OS: {
        desktop: true,
        android: false,
        chromeOS: false,
        cordova: false,
        crosswalk: false,
        ejecta: false,
        electron: false,
        iOS: false,
        iPad: false,
        iPhone: false,
        kindle: false,
        linux: true,
        macOS: false,
        node: true,
        nodeWebkit: false,
        webApp: false,
        windows: false,
        windowsPhone: false,
      },
    },
  };
});
