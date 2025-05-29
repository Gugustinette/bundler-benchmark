import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-05-15",
	ssr: false,
	devtools: { enabled: true },
	modules: ["@nuxt/fonts", "@nuxt/image"],
	app: {
		baseURL: "/bundler-benchmark",
		head: {
			title: "TS Bundler Benchmark",
			htmlAttrs: {
				lang: "en",
			},
			link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
		},
	},
	fonts: {
		assets: {
			prefix: "/bundler-benchmark/_fonts/",
		},
	},
	nitro: {
		prerender: {
			routes: ["/_ipx/w_600/ts-function.png", "/_ipx/w_1200/ts-function.png"],
		},
	},
});
