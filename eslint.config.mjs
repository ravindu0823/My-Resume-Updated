import next from "eslint-config-next";

const config = [
  { ignores: [".next/**", "out/**", "public/**", ".superpowers/**", "next-env.d.ts"] },
  ...next,
];

export default config;
