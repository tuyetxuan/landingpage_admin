import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
	// Cấu hình cơ bản cho JavaScript
	{
		files: ["**/*.{js,mjs,cjs,jsx}"],
		languageOptions: {
			ecmaVersion: 2021,
			sourceType: "module",
			parserOptions: {
				ecmaFeatures: {
					jsx: true, // Hỗ trợ cú pháp JSX
				},
			},
			globals: {
				...globals.browser,
				...globals.node, // Hỗ trợ Node.js cho `path`
			},
		},
		rules: {
			...js.configs.recommended.rules, // Quy tắc recommended của ESLint
			"no-unused-vars": [
				"error",
				{varsIgnorePattern: "^_", argsIgnorePattern: "^_"},
			],
		},
	},
	
	// Cấu hình cho React
	{
		files: ["**/*.{js,jsx}"],
		plugins: {
			react: pluginReact,
			"react-hooks": pluginReactHooks,
		},
		rules: {
			...pluginReact.configs.recommended.rules,
			...pluginReact.configs["jsx-runtime"].rules,
			...pluginReactHooks.configs.recommended.rules,
			"react/prop-types": "off",
			'no-unused-vars': "off",
			'react/jsx-key': [1, {checkFragmentShorthand: true}]
		},
		settings: {
			react: {
				version: "detect",
			},
		},
	},
	//
	// // Cấu hình accessibility với JSX
	// {
	// 	files: ["**/*.{js,jsx}"],
	// 	plugins: {
	// 		"jsx-a11y": pluginJsxA11y,
	// 	},
	// 	rules: {
	// 		...pluginJsxA11y.configs.recommended.rules,
	// 		'jsx-a11y/anchor-is-valid': [
	// 			'error',
	// 			{
	// 				"components": ["Link"],
	// 				"specialLink": ["hrefLeft", "hrefRight"],
	// 				"aspects": ["noHref", "invalidHref", "preferButton"]
	// 			},
	// 		],
	// 	},
	// },
	//
	// // Cấu hình quản lý import
	// {
	// 	files: ["**/*.{js,jsx}"],
	// 	plugins: {
	// 		import: pluginImport,
	// 	},
	// 	rules: {
	// 		...pluginImport.configs.recommended.rules, // Sử dụng cấu hình recommended của import
	// 		"import/order": [
	// 			"error",
	// 			{
	// 				groups: [
	// 					"builtin",
	// 					"external",
	// 					"internal",
	// 					"parent",
	// 					"sibling",
	// 					"index",
	// 				],
	// 				"newlines-between": "always",
	// 			},
	// 		],
	// 		"import/no-unresolved": ["error", {ignore: ["^node:"]}], // Bỏ qua module Node.js
	// 	},
	// 	settings: {
	// 		"import/resolver": {
	// 			node: {
	// 				extensions: [".js", ".jsx", ".ts", ".tsx"],
	// 			},
	//
	// 		},
	// 	},
	// },
	//
	// // Cấu hình Prettier
	// {
	// 	files: ["**/*.{js,jsx}"],
	// 	plugins: {
	// 		prettier: pluginPrettier,
	// 	},
	// 	rules: {
	// 		...pluginPrettier.configs.recommended.rules, // Sử dụng cấu hình recommended của Prettier
	// 		"prettier/prettier": "error",
	// 	},
	// },
];
