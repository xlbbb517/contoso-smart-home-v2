/**
 * 图片工具函数
 * 用于处理图片缓存和优化相关功能
 */

/**
 * 为图片URL添加时间戳参数，防止浏览器缓存
 * @param imageUrl 原始图片URL
 * @returns 添加了时间戳的URL
 */
export function getImageWithTimestamp(imageUrl: string): string {
  if (!imageUrl) return imageUrl;
  
  // 添加唯一时间戳参数
  const timestamp = new Date().getTime();
  const separator = imageUrl.includes('?') ? '&' : '?';
  
  return `${imageUrl}${separator}t=${timestamp}`;
}