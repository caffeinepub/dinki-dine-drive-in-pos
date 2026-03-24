/**
 * Play a short beep using Web Audio API.
 * type: 'confirm' = pleasant double-beep (customer)
 *       'alert'   = urgent triple-beep (staff new order)
 */
export function playBeep(type: "confirm" | "alert" = "confirm") {
  try {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();

    const beeps: { freq: number; start: number; dur: number }[] =
      type === "confirm"
        ? [
            { freq: 880, start: 0, dur: 0.12 },
            { freq: 1100, start: 0.16, dur: 0.18 },
          ]
        : [
            { freq: 660, start: 0, dur: 0.1 },
            { freq: 880, start: 0.13, dur: 0.1 },
            { freq: 1100, start: 0.26, dur: 0.16 },
          ];

    for (const { freq, start, dur } of beeps) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + start + 0.01);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur + 0.05);
    }

    // Close context after sounds finish
    setTimeout(() => ctx.close(), 1000);
  } catch {
    // Ignore - audio not supported or blocked
  }
}
