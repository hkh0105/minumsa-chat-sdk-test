/**
 * Global type definitions for Millie Chat SDK
 * This file declares the types available when the SDK is loaded via script tag
 */

interface MillieChatPluginOptions {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  width?: number;
  height?: number;
  zIndex?: number;
  mobileFullscreen?: boolean;
  characterImages?: string[];
  messageLimit?: number;
  onChatRoomCreated?: (sessionId: string, character: string) => Promise<void>;
  onClickSendButton?: (message: string, sessionId: string) => Promise<void>;
  onClickProfileImage?: (character: string, sessionId: string) => Promise<void>;
}

interface ShowOptions {
  sessionId: string;
  character?: string;
}

declare class MillieChatPlugin {
  setPresetId(presetId: number) {
    throw new Error("Method not implemented.");
  }
  constructor(options?: MillieChatPluginOptions);
  static newSessionId(): string;
  show(options?: ShowOptions): void;
  hide(): void;
  destroy(): void;
}

declare interface Window {
  MillieChatPlugin: typeof MillieChatPlugin;
  MillieChatSDK: {
    MillieChatPlugin: typeof MillieChatPlugin;
  };
}

declare module "millie-chat-sdk" {
  export { MillieChatPlugin };
}

// Global namespace for UMD
declare namespace MillieChatSDK {
  export class MillieChatPlugin {
    constructor(options?: MillieChatPluginOptions);
    static newSessionId(): string;
    show(options?: ShowOptions): void;
    hide(): void;
    destroy(): void;
    setPresetId: (prestId: number) => void;
  }
}
