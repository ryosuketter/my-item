import type { Metadata } from "next";
import type { Product } from "@/types/product";
import type { Company } from "@/types/product";
import { getProduct } from "@/lib/microcms";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  let product: Product | null = null;
  try {
    product = await getProduct(params.id);
  } catch {
    return {
      title: "商品が見つかりません",
      description: "指定された商品は存在しません。",
    };
  }
  if (!product) {
    return {
      title: "商品が見つかりません | 紹介",
      description: "指定された商品は存在しません。",
    };
  }
  return {
    title: `${product.name}`,
    description: product.comment || `${product.name}の詳細ページです。`,
    keywords: [
      product.name,
      ...(product.categories?.map((c: Product["categories"][0]) => c.name) ??
        []),
      ...(product.companies?.map((c) => (c as Company).name) ?? []),
    ].join(","),
    openGraph: {
      title: `${product.name} | shimizu item`,
      description: product.comment,
      type: "website",
      url: `https://shimizu-item.vercel.app/product/${product.id}`,
      siteName: "shimizu-item",
      images: product.photos?.[0]?.url
        ? [{ url: product.photos[0].url, alt: product.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.comment,
      images: product.photos?.[0]?.url ? [product.photos[0].url] : undefined,
    },
  };
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
