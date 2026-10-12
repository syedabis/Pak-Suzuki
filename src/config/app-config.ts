import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Meezan Oil",
  version: packageJson.version,
  logo: "/meezan_logo.png",
  copyright: `© ${currentYear}, Paracha Textile Mills Ltd. (Meezan Oil).`,
  meta: {
    title: "Meezan Oil • D2D Field Sales & Market Intelligence",
    description: "Direct-to-consumer field sales, doorstep surveys, and distribution tracking for Meezan Oil.",
  },
};
