import type { Profile } from "./types";

export async function analyzeImage(file: File): Promise<Profile> {
  const form = new FormData();
  form.append("image", file);

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail.detail || `Request failed: ${res.status}`);
  }

  return res.json();
}
