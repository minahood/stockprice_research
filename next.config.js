/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // google-trends-api references @std/testing/mock in its dependencies.
    // Alias it to false so webpack treats it as an empty module.
    config.resolve.alias["@std/testing/mock"] = false;
    return config;
  },
}

module.exports = nextConfig
