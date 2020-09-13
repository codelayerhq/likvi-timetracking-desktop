export function secondsToHours(seconds: number, showSeconds = true): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const hFormat = h.toString().padStart(h < 10 ? 2 : 1, "0");
  const mFormat = m.toString().padStart(m < 10 ? 2 : 1, "0");
  const sFormat = s.toString().padStart(s < 10 ? 2 : 1, "0");

  return showSeconds
    ? `${hFormat}:${mFormat}:${sFormat}`
    : `${hFormat}:${mFormat}`;
}
