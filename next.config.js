// Configure basePath/assetPrefix when building on GitHub Pages so assets resolve under /<repo>
const isGithubActions = process.env.GITHUB_ACTIONS === 'true'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''
const prefix = isGithubActions && repoName ? `/${repoName}` : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'build',
  trailingSlash: true,
  // Only set when deploying to GitHub Pages (e.g., https://user.github.io/<repo>/)
  ...(prefix
    ? {
        basePath: prefix,
        // assetPrefix needs trailing slash so runtime publicPath is correct
        assetPrefix: `${prefix}/`,
      }
    : {}),
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
