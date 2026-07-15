/**
 * Product release metadata has one owner. The release workflow flips
 * `available` only after the AOS CLI, embedded runtime, BLAKE3 and compatibility
 * digest manifests, Sigstore bundles, and installer share one published version.
 */
export const AOS_RELEASE = {
  version: '2026.1.0',
  available: false,
  installCommand: "curl --proto '=https' --tlsv1.2 -fsSL https://aos.unicity.ai/install.sh | sh",
  repository: 'https://github.com/unicity-aos/aos-ce',
} as const;
