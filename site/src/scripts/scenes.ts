/**
 * Scroll choreography. Principles: sections reveal as they enter; the capsule
 * scene docks capsules with scroll progress; nothing traps the wheel; with
 * reduced motion everything renders in its completed state and this module
 * does nothing.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initScenes(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // completed states: all capsules docked, all topics lit
    document.getElementById('capsule-bus')?.setAttribute('docked', '6');
    document.querySelectorAll('.topic').forEach((t) => t.setAttribute('data-lit', ''));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // generic section reveals
  for (const scene of document.querySelectorAll<HTMLElement>('[data-scene]')) {
    const targets = scene.querySelectorAll<HTMLElement>(
      '.scene-copy, .scene-stage, .prose, .layers, .grow-steps, .grow-quote, .books-grid, .cap-rig',
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

  // capsule docking driven by scroll progress through the section
  const capsuleScene = document.querySelector<HTMLElement>('[data-capsule-scene]');
  const capsuleBus = document.getElementById('capsule-bus');
  const topics = Array.from(document.querySelectorAll<HTMLElement>('.topic'));
  if (capsuleScene && capsuleBus) {
    ScrollTrigger.create({
      trigger: capsuleScene,
      start: 'top 65%',
      end: 'bottom 60%',
      onUpdate(self) {
        const docked = Math.round(self.progress * 6);
        capsuleBus.setAttribute('docked', String(docked));
        topics.forEach((t, i) => {
          if (self.progress * (topics.length + 1) > i + 0.5) t.setAttribute('data-lit', '');
          else t.removeAttribute('data-lit');
        });
      },
    });
  }

  // grow steps cascade
  const steps = document.querySelectorAll<HTMLElement>('[data-step]');
  if (steps.length) {
    gsap.from(steps, {
      y: 36,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '#grow', start: 'top 70%' },
    });
  }
}
