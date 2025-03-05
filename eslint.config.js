import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    // 무시할 파일 설정
    ignores: ["dist"],
  },
  {
    // 파일과 언어 옵션 설정
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest", // 최신 ECMAScript 지원
      sourceType: "module",
      globals: globals.browser,
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.node.json"], // TypeScript 프로젝트 설정
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": typescript,
    },
    // 확장 설정
    extends: [js.configs.recommended, ...typescript.configs.recommended],
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
  {
    // 추가 parserOptions 설정
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      project: ["./tsconfig.json", "./tsconfig.node.json"],
      tsconfigRootDir: __dirname,
    },
  },
];
