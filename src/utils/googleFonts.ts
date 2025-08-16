import WebFont from "webfontloader";

export function loadGoogleFont(fontName: string) {
  WebFont.load({
    google: {
      families: [fontName],
    },
  });
}
