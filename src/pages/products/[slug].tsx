import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/language-context';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { getImageWithTimestamp } from '@/lib/imageUtils';
import ReactMarkdown from 'react-markdown';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import clsx from 'clsx';

type Section = 'overview' | 'features' | 'reviews' | 'faq' | 'specs' | 'warranty' | 'guide';

type MarkdownSections = {
  [key in Section]: string;
};

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { locale } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [productInfo, setProductInfo] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState<Section>('overview');
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch('/products.json');
        const products = await res.json();
        const foundProduct = products.find((p: Product) => p.slug === slug);
        setProduct(foundProduct || null);
        
        if (foundProduct) {
          setImages(foundProduct.images || []);
          
          // 获取对应语言的markdown内容
          const markdownPath = locale === 'zh' 
            ? `/manuals/zh/product_info_${foundProduct?.id}.md`
            : `/manuals/product_info_${foundProduct?.id}.md`;
            
          const markdownRes = await fetch(markdownPath);
          const markdownText = await markdownRes.text();
          setProductInfo(markdownText);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug, locale]);

  const parseMarkdownSections = (): MarkdownSections => {
    const sections: MarkdownSections = {
      overview: '',
      features: '',
      reviews: '',
      faq: '',
      specs: '',
      warranty: '',
      guide: ''
    };

    const lines = productInfo.split('\n');
    let currentSection: Section = 'overview';
    
    lines.forEach(line => {
      if (line.startsWith('# ')) {
        // 跳过主标题
        return;
      } else if (line.startsWith('## Features') || line.startsWith('## 功能特点')) {
        currentSection = 'features';
      } else if (line.startsWith('## Reviews') || line.startsWith('## 评论')) {
        currentSection = 'reviews';
      } else if (line.startsWith('## FAQ') || line.startsWith('## 常见问题')) {
        currentSection = 'faq';
      } else if (line.startsWith('## Technical Specs') || line.startsWith('## 技术规格')) {
        currentSection = 'specs';
      } else if (line.startsWith('## Warranty') || line.startsWith('## 保修信息')) {
        currentSection = 'warranty';
      } else if (line.startsWith('## User Guide') || line.startsWith('## 用户指南')) {
        currentSection = 'guide';
      } else {
        sections[currentSection] += line + '\n';
      }
    });

    return sections;
  };

  const sections = [
    { id: 'overview', name: locale === 'zh' ? '概述' : 'Overview' },
    { id: 'features', name: locale === 'zh' ? '功能特点' : 'Features' },
    { id: 'reviews', name: locale === 'zh' ? '评论' : 'Reviews' },
    { id: 'faq', name: locale === 'zh' ? '常见问题' : 'FAQ' },
    { id: 'specs', name: locale === 'zh' ? '技术规格' : 'Technical Specs' },
    { id: 'warranty', name: locale === 'zh' ? '保修信息' : 'Warranty' },
    { id: 'guide', name: locale === 'zh' ? '用户指南' : 'User Guide' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-secondary">
          {locale === 'zh' ? "加载中..." : "Loading..."}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-secondary">
          {locale === 'zh' ? "产品未找到" : "Product not found"}
        </div>
      </div>
    );
  }

  const markdownSections = parseMarkdownSections();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 产品标题区域 */}
        <div className="mb-8">
          <h1 className="font-serif text-5xl text-gray-900 mb-4">
            <span className="text-7xl font-bold">T</span>he {product.nameZh && locale === 'zh' ? product.nameZh : product.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl">
            {product.descriptionZh && locale === 'zh' ? product.descriptionZh : product.description}
          </p>
        </div>

        {/* 导航标签 */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id as Section)}
                className={clsx(
                  'pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                  currentSection === section.id
                    ? 'border-secondary-dark text-secondary-dark'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧产品图片 */}
          <div className="lg:col-span-5">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <Carousel
                  showArrows={true}
                  showStatus={false}
                  showThumbs={true}
                  infiniteLoop={true}
                  className="product-carousel"
                >
                  {images.map((image, index) => (
                    <div key={index} className="carousel-slide">
                      <Image
                        src={getImageWithTimestamp(image)}
                        alt={`${product.nameZh && locale === 'zh' ? product.nameZh : product.name} - ${index + 1}`}
                        width={800}
                        height={600}
                        className="object-contain"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-3xl font-bold text-accent mb-4">
                  ${product.price.toFixed(2)}
                </div>
                <div className="space-y-4">
                  <button className="w-full bg-secondary-dark text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                    {locale === 'zh' ? "立即购买" : "Buy Now"}
                  </button>
                  <button className="w-full border border-secondary-dark text-secondary-dark px-6 py-3 rounded-lg font-medium hover:bg-hover transition-colors">
                    {locale === 'zh' ? "加入购物车" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧内容区域 */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="prose max-w-none">
                <ReactMarkdown>{markdownSections[currentSection]}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .product-carousel {
          background: white;
          border-radius: 0.75rem;
        }
        .carousel-slide {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
        }
        .carousel .thumb {
          border: 2px solid transparent;
          border-radius: 4px;
          padding: 2px;
        }
        .carousel .thumb.selected {
          border-color: #4A5568;
        }
        .prose {
          color: #4A5568;
        }
        .prose h1 {
          font-family: serif;
          color: #1a202c;
        }
        .prose h2 {
          color: #2D3748;
          font-weight: 600;
        }
        .prose h3 {
          color: #2D3748;
          font-weight: 500;
        }
        .prose ul {
          list-style-type: disc;
          padding-left: 1.5em;
        }
        .prose p {
          margin-bottom: 1.5em;
        }
      `}</style>
    </div>
  );
} 