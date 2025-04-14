/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
  },
  output: 'standalone',
  
  // 添加缓存控制配置
  async headers() {
    return [
      {
        // 针对图片文件路径
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // 针对多语言手册文件 - 减少缓存时间以确保内容更新
        source: '/manuals/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      }
    ]
  },
}

module.exports = nextConfig
