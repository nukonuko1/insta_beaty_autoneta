"use client";
import { useLocalStorage } from "./useLocalStorage";

const MAX_SAVED = 8;

export function useSavedInputs() {
  const [savedInputs, setSavedInputs] = useLocalStorage<string[]>(
    "savedInputs_v1",
    []
  );

  function saveInput(input: string) {
    const trimmed = input.trim();
    if (!trimmed) return;
    setSavedInputs((prev) => {
      const filtered = prev.filter((s) => s !== trimmed);
      return [trimmed, ...filtered].slice(0, MAX_SAVED);
    });
  }

  function removeInput(index: number) {
    setSavedInputs((prev) => prev.filter((_, i) => i !== index));
  }

  return { savedInputs, saveInput, removeInput };
}
