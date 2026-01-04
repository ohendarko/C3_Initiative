import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.config({
    extends: ['next'],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      // Optional: turn these back on globally if needed
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-require-imports": "error"
    },
    overrides: [
      {
        files: ["lib/generated/prisma/**"],
        rules: {
          "@typescript-eslint/no-unused-vars": "off",
          "@typescript-eslint/no-require-imports": "off"
        }
      }
    ]
  }),
];

export default eslintConfig;
