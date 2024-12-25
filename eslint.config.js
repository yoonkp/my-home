import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
    },
    settings: {
      "import/resolver": {
        alias: {
          map: [
            ["@", "./src/"], // '@' 별칭이 'src/' 디렉토리를 가리키도록 설정
          ],
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        },
      },
    },
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      project: ["./tsconfig.json", "./tsconfig.node.json"],
      tsconfigRootDir: __dirname,
    },
  }
);