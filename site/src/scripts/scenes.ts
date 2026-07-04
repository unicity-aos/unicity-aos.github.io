/**
 * Scroll choreography. The rail (astrid-rail) handles all dock/clamp visuals
 * itself; this module only reveals section content as it enters. Nothing
 * traps the wheel; with reduced motion everything renders in its completed
 * state and this module does nothing.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Leaving the page (client-router swap) strands triggers on removed DOM;
// kill them at the boundary so nothing computes against dead elements.
document.addEventListener('astro:before-swap', () => {
  for (const t of ScrollTrigger.getAll()) t.kill();
});

export function initScenes(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // Client-router navigations replace the content while this module (and
  // GSAP) persist: kill triggers bound to the previous page's DOM first.
  for (const t of ScrollTrigger.getAll()) t.kill();

  // generic section reveals
  for (const scene of document.querySelectorAll<HTMLElement>('[data-scene]')) {
    const targets = scene.querySelectorAll<HTMLElement>(
      '.thesis-line, .thesis-note, .scene-copy, .endpoints, .capsule-rack, .prose, .layers, .layers-rig, .grow-quote, .books-grid, .cap-rig, .aud-grid',
    );
    if (!targets.length) continue;
    gsap.from(targets, {
      y: 28,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: scene, start: 'top 72%' },
    });
  }

  // stations cascade in as the spine reaches them
  const steps = document.querySelectorAll<HTMLElement>('[data-step]');
  for (const step of steps) {
    gsap.from(step, {
      x: 24,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: step, start: 'top 78%' },
    });
  }
}
