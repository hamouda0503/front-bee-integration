export class SpotifyIFrameAPI {
      createController: (element: HTMLElement, options: { uri: string }, callback: (controller: any) => void) => void;
}
declare global {
  interface Window {
    onSpotifyIframeApiReady: (IFrameAPI: SpotifyIFrameAPI) => void;
    EmbedController: any;
}
}