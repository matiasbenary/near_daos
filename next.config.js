/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'build',
  trailingSlash: true,
  images: {
    domains: ['ipfs.near.social'],
    unoptimized: true,
  },
  transpilePackages: [
    '@uiw/react-md-editor',
    '@uiw/react-markdown-preview'
  ],
}

module.exports = nextConfig
