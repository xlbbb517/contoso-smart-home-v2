/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Removing i18n configuration as it's not compatible with App Router in Next.js 13+
  // i18n is now handled via middleware.ts file
  
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
