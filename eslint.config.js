import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default [
  {
    // 무시할 파일 설정
    ignores: ["dist"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // 파일과 언어 옵션 설정
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest", // 최신 ECMAScript 지원
      sourceType: "module",
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off", // 필요하면 경고 제거
      "no-unused-vars": "off",
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [["@", "./src/"]],
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      },
    },
  },
];
