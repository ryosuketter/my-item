import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/microcms";
import type { Product, Category } from "@/types/product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://shimizu-item.vercel.app";

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  try {
    // 全商品を取得（limitは100以下）
    const productsResponse = await getProducts({ limit: 100 });
    const products = productsResponse.contents || [];

    console.log(`Found ${products.length} products`);

    // 商品詳細ページのURL
    const productPages: MetadataRoute.Sitemap = products.map(
      (product: Product) => ({
        url: `${baseUrl}/product/${product.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    );

    // 全カテゴリを取得
    const categoriesResponse = await getCategories({ limit: 100 });
    const categories = categoriesResponse.contents || [];

    console.log(`Found ${categories.length} categories`);

    // カテゴリフィルタページのURL
    const categoryPages: MetadataRoute.Sitemap = categories.map(
      (category: Category) => ({
        url: `${baseUrl}/?category=${encodeURIComponent(category.slug || category.name)}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })
    );

    const allPages = [...staticPages, ...productPages, ...categoryPages];
    console.log(`Total sitemap entries: ${allPages.length}`);

    return allPages;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // エラーの場合は静的ページのみを返す
    return staticPages;
  }
}
