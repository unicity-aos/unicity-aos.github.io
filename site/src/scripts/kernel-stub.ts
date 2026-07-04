/**
 * Build-time stand-in used ONLY while kernel-web/pkg has not been built yet
 * (astro.config aliases 'kernel-web' here in that case). It throws on init,
 * which drops the page into its honest static mode. Never shipped once the
 * real pkg exists.
 */
export default async function init(): Promise<never> {
  throw new Error('kernel-web pkg not built');
}

export const AstridWeb = {
  boot(): never {
    throw new Error('kernel-web pkg not built');
  },
};
