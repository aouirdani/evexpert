/** Styles explicites des composants contrôlés au lot 2 ; aucun défaut global modifié. */
const actionBase =
  "inline-flex min-w-11 items-center rounded-md transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50";

const choiceBase = `${actionBase} justify-center border px-3 py-2 text-sm font-semibold`;

export const choiceActionClass = `${choiceBase} min-h-11`;

export const comfortableChoiceActionClass = `${choiceBase} min-h-12`;

export const iconActionClass = `${actionBase} h-11 w-11 justify-center border`;

export const textActionClass =
  `${actionBase} min-h-11 max-w-full justify-start gap-2 px-2 py-2 text-left text-sm font-semibold text-signal-deep enabled:hover:bg-paper-deep`;

export const inputPanelClass = "min-w-0 rounded-md border border-line bg-surface p-5 sm:p-6";

export const resultPanelClass = "on-ink min-w-0 rounded-md border border-line-ink bg-ink p-6 text-paper sm:p-8";
