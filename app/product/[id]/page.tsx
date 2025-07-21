"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SiLine } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";
import type { Product } from "@/types/product";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError("データの取得に失敗しました");
        setLoading(false);
      });
  }, [productId]);

  // 関連商品は一旦省略 or 別途APIで取得する形にできます

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">読み込み中...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            商品が見つかりません
          </h1>
          <Button onClick={() => router.push("/")}>トップページに戻る</Button>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={`star-${rating}-${i}`}
        className={`w-5 h-5 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.photos.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.photos.length) % product.photos.length
    );
  };

  const handleLineShare = () => {
    const text = encodeURIComponent(`${product.name}\n${window.location.href}`);
    const lineUrl = `https://line.me/R/share?text=${text}`;
    window.open(lineUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
            <h1 className="text-base font-bold text-gray-900 truncate">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLineShare}
                aria-label="LINEでシェア"
              >
                <SiLine className="w-5 h-5 text-green-500" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずナビ */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">ホーム</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/?category=${product.categories[0].name}`}>
                {product.categories[0].slug}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 画像ギャラリー */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-white rounded-lg overflow-hidden">
              <Image
                src={
                  product.photos[currentImageIndex]?.url || "/placeholder.svg"
                }
                alt={`${product.name} - 画像 ${currentImageIndex + 1}`}
                fill
                className="object-cover"
              />
              {product.photos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {/* サムネイル */}
            {product.photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.photos.map((photo, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={photo.url || "/placeholder.svg"}
                      alt={`${product.name} - サムネイル ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 商品情報 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {product.categories.map((category) => (
                  <a
                    key={category.id}
                    href={`/?category=${encodeURIComponent(category.name)}`}
                  >
                    <Badge variant="secondary">{category.name}</Badge>
                  </a>
                ))}
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <div className="text-2xl font-bold">
                  ¥{product.price.toLocaleString()}
                </div>
              </div>

              <Button asChild size="lg" className="w-full mb-4">
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  購入サイトで詳細を見る
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 詳細レビュー */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="py-6">
              <CardHeader>
                <CardTitle>レビュー</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-none rich-content">
                  {product.detailedComment && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.detailedComment,
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* YouTube動画 */}
            {product.videoUrl && (
              <Card className="py-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    動画
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <iframe
                      src={product.videoUrl}
                      title={`${product.name} 紹介動画`}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 良い点・注意点 */}
            {(product.pros || product.cons) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.pros && (
                  <Card className="py-6">
                    <CardHeader>
                      <CardTitle className="text-green-600">👍</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {product.pros.map((pro, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {product.cons && (
                  <Card className="py-6">
                    <CardHeader>
                      <CardTitle className="text-orange-600">👎</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {product.cons.map((con, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 関連商品 */}
            {product.relatedProducts && product.relatedProducts.length > 0 && (
              <Card className="py-6">
                <CardHeader>
                  <CardTitle>関連</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {product.relatedProducts.map((relatedProduct) => (
                      <div key={relatedProduct.id} className="flex gap-3">
                        <Image
                          src={
                            relatedProduct.photos[0]?.url || "/placeholder.svg"
                          }
                          alt={relatedProduct.name}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            <a
                              href={`/product/${relatedProduct.id}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {relatedProduct.name}
                            </a>
                          </h4>
                          <div className="flex items-center gap-1 mb-1">
                            {renderStars(relatedProduct.rating)}
                          </div>
                          <div className="text-sm font-bold text-blue-600">
                            ¥{relatedProduct.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
