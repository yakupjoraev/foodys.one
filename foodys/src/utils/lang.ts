export function getLangFromLocale(locale?: string): "FR" | "EN" {
  switch (locale) {
    case "fr": {
      return "FR";
    }
    case "en": {
      return "EN";
    }
    default: {
      return "FR";
    }
  }
}
