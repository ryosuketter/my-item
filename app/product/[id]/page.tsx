"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Play,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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

// モックデータ（実際のアプリケーションではAPIから取得）
const mockProducts = [
  {
    id: 1,
    name: "Apple MacBook Air M2",
    link: "https://example.com/macbook",
    detailedComment:
      "Apple MacBook Air M2は、私が今まで使ったノートパソコンの中で最も満足度の高い一台です。\n\n【良い点】\n• M2チップの処理能力が素晴らしく、重いアプリケーションもサクサク動作\n• バッテリー持ちが一日中使っても余裕で持つ\n• ファンレス設計で完全に無音\n• 軽量（1.24kg）で持ち運びが楽\n• Retinaディスプレイが美しい\n\n【注意点】\n• ポート数が少ない（USB-C x2、MagSafe、ヘッドホンジャック）\n• 外部モニターは1台まで\n• メモリ増設不可なので購入時に慎重に選択\n\n特にプログラマーやクリエイターにおすすめです。Xcodeでのアプリ開発、Final Cut Proでの動画編集も快適に行えます。",
    photos: [
      "https://design-library.jp/tech/wp-content/uploads/sites/2/1574303866_9f5bb0dd.jpg",
      "https://picsum.photos/536/354",
      "https://picsum.photos/537/354",
      "https://picsum.photos/535/354",
    ],
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    price: 164800,
    categories: ["ガジェット", "パソコン"],
    rating: 4,
    pros: [
      "優れた処理性能",
      "長時間バッテリー",
      "軽量で持ち運びやすい",
      "静音設計",
      "美しいディスプレイ",
    ],
    cons: ["ポート数が少ない", "メモリ増設不可", "外部モニター1台まで"],
  },
  {
    id: 2,
    name: "Sony WH-1000XM5",
    link: "https://example.com/sony-headphones",
    detailedComment:
      "Sony WH-1000XM5は、ノイズキャンセリングヘッドホンの最高峰だと思います。",
    photos: [
      "https://design-library.jp/tech/wp-content/uploads/sites/2/1574303866_9f5bb0dd.jpg",
      "https://design-library.jp/tech/wp-content/uploads/sites/2/1574303866_9f5bb0dd.jpg",
    ],
    videoUrl: "",
    price: 49500,
    categories: ["ガジェット", "オーディオ"],
    rating: 4,
    pros: ["最高クラスのノイズキャンセリング", "高音質", "長時間バッテリー"],
    cons: ["価格が高い", "折りたたみ不可"],
  },
  // 他の商品データも同様に拡張...
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number.parseInt(params.id as string);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = mockProducts.find((p) => p.id === productId);

  // 関連商品（同じカテゴリの他の商品）
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return mockProducts
      .filter(
        (p) =>
          p.id !== productId &&
          p.categories.some((cat) => product.categories.includes(cat))
      )
      .slice(0, 3);
  }, [product, productId]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            商品が見つかりません
          </h1>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            トップページに戻る
          </Button>
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.detailedComment,
          url: window.location.href,
        });
      } catch (err) {
        console.log("共有がキャンセルされました");
      }
    } else {
      // フォールバック: URLをクリップボードにコピー
      navigator.clipboard.writeText(window.location.href);
      alert("URLをクリップボードにコピーしました");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => router.push("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              商品一覧に戻る
            </Button>
            <h1 className="text-xl font-bold text-gray-900 truncate">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
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
              <BreadcrumbLink href={`/?category=${product.categories[0]}`}>
                {product.categories[0]}
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
                src={product.photos[currentImageIndex] || "/placeholder.svg"}
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
                      src={photo || "/placeholder.svg"}
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
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <div className="text-2xl font-bold text-blue-600">
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
                <div className="prose max-w-none">
                  {product.detailedComment
                    ?.split("\n")
                    .map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
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
            {relatedProducts.length > 0 && (
              <Card className="py-6">
                <CardHeader>
                  <CardTitle>関連</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatedProducts.map((relatedProduct) => (
                      <div key={relatedProduct.id} className="flex gap-3">
                        <Image
                          src={relatedProduct.photos[0] || "/placeholder.svg"}
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
