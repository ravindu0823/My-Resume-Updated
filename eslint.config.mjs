import next from "eslint-config-next";

const config = [
  { ignores: [".next/**", "out/**", "public/**", ".superpowers/**", "next-env.d.ts"] },
  ...next,
  {
    rules: {
      // Static export with images pre-optimized by scripts/images.mjs: there is no image optimizer
      // for next/image to call, so plain <img>/<picture> is the correct element here.
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;
