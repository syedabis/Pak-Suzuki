import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Pak Suzuki",
  version: packageJson.version,
  logo: "/_Logo.png",
  copyright: `© ${currentYear}, Pak Suzuki Motor Company Ltd. (PSMCL).`,
  meta: {
    title: "Pak Suzuki • Operational Intelligence & Regional Benchmarking",
    description:
      "Centralized operational intelligence, showroom footfall, and business benchmarking across 3S dealerships and mega galas.",
  },
};
