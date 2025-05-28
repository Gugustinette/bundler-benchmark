import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-05-15",
	ssr: false,
	devtools: { enabled: true },
	modules: ["@nuxt/fonts", "@nuxt/image"],
	app: {
		baseURL: "/bundler-benchmark",
	},
	fonts: {
		assets: {
			prefix: "/bundler-benchmark/_fonts/",
		},
	},
});
