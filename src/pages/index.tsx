import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from '@/lib/language-context';
import Image from 'next/image';
import Block from '@/components/block';
import { getImageWithTimestamp } from '@/lib/imageUtils';
import clsx from 'clsx';
import { Product, ProductGroup } from '@/lib/types';

export default function Home({
  params,
  searchParams,
}: {
  params?: { lang: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { t, locale } = useTranslation();
  const [categories, setCategories] = useState<ProductGroup[]>([]);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await fetch('/categories.json');
        const productsRes = await fetch('/products.json');
        
        const categoriesData = await categoriesRes.json();
        const productsData = await productsRes.json();
        
        categoriesData.forEach((category: ProductGroup) => {
          category.products = productsData.filter((product: Product) => 
            product.category === category.name
          );
        });
        
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);

  if (!isClient) {
    return (
      <>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      
      {/* Hero Section */}
      <Block innerClassName="py-12">
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-secondary-light mb-4">
              {locale === 'zh' ? "Contoso 智能家居" : "Contoso Smart Home"}
            </h1>
            <p className="text-xl text-secondary mb-8">
              {locale === 'zh' 
                ? "Contoso 通过无缝集成的智能设备生态系统为日常生活带来智能化。使用简单的语音命令或我们直观的移动应用程序控制您的整个家居。"
                : "Contoso brings intelligence to everyday living with our seamlessly integrated ecosystem of smart devices. Control your entire home with simple voice commands or our intuitive mobile app."
              }
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
                <div className="text-secondary-light font-medium mb-1">
                  {locale === 'zh' ? "节能环保" : "Energy Efficient"}
                </div>
                <div className="text-sm text-secondary">
                  {locale === 'zh' ? 
                    "通过我们的智能家居解决方案，节省高达23%的公用事业账单" : 
                    "Save up to 23% on utility bills with our smart home solutions"
                  }
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
                <div className="text-secondary-light font-medium mb-1">
                  {locale === 'zh' ? "简易安装" : "Easy Setup"}
                </div>
                <div className="text-sm text-secondary">
                  {locale === 'zh' ? 
                    "通过我们即插即用的设备，几分钟内即可开始使用" : 
                    "Get started in minutes with our plug-and-play devices"
                  }
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
                <div className="text-secondary-light font-medium mb-1">
                  {locale === 'zh' ? "兼容性强" : "Compatible"}
                </div>
                <div className="text-sm text-secondary">
                  {locale === 'zh' ? 
                    "可与100多种第三方设备和服务兼容" : 
                    "Works with over 100 third-party devices and services"
                  }
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm hover:shadow transition-shadow">
                <div className="text-secondary-light font-medium mb-1">
                  {locale === 'zh' ? "安全可靠" : "Secure"}
                </div>
                <div className="text-sm text-secondary">
                  {locale === 'zh' ? 
                    "端到端加密确保您的数据和家庭安全" : 
                    "End-to-end encryption keeps your data and home safe"
                  }
                </div>
              </div>
            </div>
          </div>
          {isClient && (
            <div className="md:w-1/2">
              <div className="bg-white p-8 rounded-xl shadow-sm h-full flex flex-col">
                <div className="text-secondary-light font-medium text-xl mb-3">
                  {locale === 'zh' ? "智能家居仪表盘" : "Smart Home Dashboard"}
                </div>
                <div className="text-secondary mb-8 text-lg">
                  {locale === 'zh' ? "实时监控您的家居状态" : "Monitor your home status in real-time"}
                </div>
                <div className="grid grid-cols-2 gap-6 mt-auto">
                  <div className="bg-primary-light p-6 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🏠</span>
                      <div className="flex-1">
                        <div className="text-sm text-secondary mb-1">
                          {locale === 'zh' ? "家庭状态" : "Home Status"}
                        </div>
                        <div className="text-secondary-light font-medium text-lg">
                          {locale === 'zh' ? "安全" : "Secure"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary-light p-6 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">🌡️</span>
                      <div className="flex-1">
                        <div className="text-sm text-secondary mb-1">
                          {locale === 'zh' ? "温度" : "Temperature"}
                        </div>
                        <div className="text-secondary-light font-medium text-lg">72°F</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary-light p-6 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💡</span>
                      <div className="flex-1">
                        <div className="text-sm text-secondary mb-1">
                          {locale === 'zh' ? "照明" : "Lighting"}
                        </div>
                        <div className="text-secondary-light font-medium text-lg">
                          {locale === 'zh' ? "开启" : "On"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary-light p-6 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">⚡</span>
                      <div className="flex-1">
                        <div className="text-sm text-secondary mb-1">
                          {locale === 'zh' ? "能源" : "Energy"}
                        </div>
                        <div className="text-secondary-light font-medium text-lg">
                          {locale === 'zh' ? "最佳" : "Optimal"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Block>
      
      {/* Categories */}
      {categories.map((category, i) => (
        <Block
          key={i}
          innerClassName="p-8"
          outerClassName={clsx(i % 2 == 1 ? "bg-primary-light" : "bg-primary")}
        >
          <div className="text-3xl mb-3 font-medium text-secondary-light">
            {category.nameZh && locale === 'zh' ? category.nameZh : category.name}
          </div>
          <div className="text-secondary text-xl mb-6">
            {category.descriptionZh && locale === 'zh' ? category.descriptionZh : category.description}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {category.products && category.products.length > 0 ? (
              category.products.map((product, j) => (
                <div key={j} className="group">
                  <div className="flex flex-col">
                    <div className="bg-white p-4 rounded-xl shadow-sm group-hover:shadow transition-shadow relative">
                      {/* Product image with white background */}
                      <div className="bg-white rounded-lg mb-4">
                        <Image
                          src={getImageWithTimestamp(product.images[0])}
                          alt={product.nameZh && locale === 'zh' ? product.nameZh : product.name}
                          width={220}
                          height={220}
                          className="object-contain w-full h-48"
                        />
                      </div>
                      
                      {/* Product name in bold, black */}
                      <div className="text-lg font-bold text-secondary-light">
                        {product.nameZh && locale === 'zh' ? product.nameZh : product.name}
                      </div>
                      
                      {/* Product price */}
                      <div className="text-accent font-medium mt-1 mb-3">
                        ${product.price.toFixed(2)}
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-2 mt-2">
                        <a 
                          href="#"
                          className="bg-secondary-dark text-white px-3 py-2 rounded text-sm font-medium text-center flex-1 hover:bg-opacity-90 transition-colors"
                        >
                          {locale === 'zh' ? "立即购买" : "Buy now"}
                        </a>
                        <a 
                          href={`/${locale}/products/${product.slug}${searchParams?.type ? "?type=" + searchParams.type : ""}`}
                          className="border border-secondary-dark text-secondary-dark px-3 py-2 rounded text-sm font-medium text-center flex-1 hover:bg-hover transition-colors"
                        >
                          {locale === 'zh' ? "了解更多" : "Learn more"}
                        </a>
                      </div>
                      
                      {/* Special tags */}
                      {j % 5 === 0 && (
                        <div className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
                          {locale === 'zh' ? "优惠11%" : "11% off"}
                        </div>
                      )}
                      {j % 7 === 0 && (
                        <div className="absolute top-2 left-2 bg-secondary text-white text-xs font-medium px-2 py-1 rounded">
                          {locale === 'zh' ? "缺货" : "Out of stock"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-secondary py-8 col-span-4">
                {locale === 'zh' 
                  ? `即将推出！我们最新的${category.name.toLowerCase()}产品将很快上市。`
                  : `Coming soon! Our newest ${category.name.toLowerCase()} products will be available shortly.`
                }
              </div>
            )}
          </div>
        </Block>
      ))}
    </>
  );
} 