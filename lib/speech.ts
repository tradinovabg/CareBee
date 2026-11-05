export type SpeechResult = { isFinal: boolean; 0: { transcript: string } };
export type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: { results: ArrayLike<SpeechResult> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  start(): void; stop(): void; abort(): void;
};
export type RecognitionConstructor = new () => Recognition;
export function getRecognition(): RecognitionConstructor | undefined {
  const browser = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
  return browser.SpeechRecognition || browser.webkitSpeechRecognition;
}
export function speechError(code: string): string {
  const messages: Record<string, string> = {
    'not-allowed': 'Доступ к микрофону запрещён. Разрешите микрофон в настройках сайта браузера и попробуйте снова или введите текст вручную.',
    'service-not-allowed': 'Браузер запретил сервис распознавания. Попробуйте другой браузер или введите текст вручную.',
    'audio-capture': 'Микрофон недоступен. Проверьте подключение и разрешения или введите текст вручную.',
    'network': 'Не удалось подключиться к сервису распознавания. Проверьте интернет или введите текст вручную.',
    'no-speech': 'Речь не обнаружена. Попробуйте ещё раз или введите текст вручную.',
    'language-not-supported': 'Русский язык недоступен в сервисе этого браузера. Введите текст вручную.',
    'aborted': 'Запись остановлена. Можно продолжить вручную.',
  };
  return messages[code] || 'Не удалось распознать речь. Попробуйте снова или введите текст вручную.';
}
