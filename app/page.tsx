"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Filter, Star, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useCategoryQueryParam } from "@/hooks/useCategoryQueryParam";
import { useRatingQueryParam } from "@/hooks/useRatingQueryParam";
import { useSortQueryParam } from "@/hooks/useSortQueryParam";
import Link from "next/link";
import type { Product, Category } from "@/types/product";

export default function ProductComparisonSite() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useSortQueryParam("rating-desc");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ])
      .then(([productsData, categoriesData]) => {
        setProducts(productsData.contents || []);
        setAllCategories(categoriesData.contents || []);
        setLoading(false);
      })
      .catch(() => {
        setError("データの取得に失敗しました");
        setLoading(false);
      });
  }, []);

  // productsに紐付いているカテゴリだけを抽出
  const usedCategoryIds = useMemo(
    () =>
      new Set(
        products.flatMap((p) => p.categories?.map((cat) => cat.id) || [])
      ),
    [products]
  );
  // 初期表示時はallCategories、products取得後は紐付くカテゴリのみ
  const categoriesForUI = useMemo(() => {
    if (products.length === 0) return allCategories;
    return allCategories.filter((cat) => usedCategoryIds.has(cat.id));
  }, [allCategories, usedCategoryIds, products.length]);

  const [selectedCategories, handleCategoryChange] = useCategoryQueryParam(
    categoriesForUI.map((cat) => cat.name)
  );
  const [minRating, setMinRating] = useRatingQueryParam();

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.comment?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) =>
          product.categories?.some((c) => c.name === cat)
        );
      const matchesRating = product.rating >= minRating;
      return matchesSearch && matchesCategory && matchesRating;
    });
    filtered.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating-desc":
          return b.rating - a.rating;
        case "rating-asc":
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
    return filtered;
  }, [products, searchTerm, selectedCategories, minRating, sort]);

  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={`star-${rating}-${i}`}
        className={`w-2.5 h-2.5 sm:w-4 sm:h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  }, []);

  const FilterContent = useCallback(
    () => (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3 pl-1">カテゴリ</h3>
          <div className="space-y-2">
            {categoriesForUI.map((category) => (
              <div
                key={category.id}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  id={category.name}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.name, !!checked)
                  }
                />
                <label
                  htmlFor={category.name}
                  className="text-sm font-medium cursor-pointer flex-1"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-3">評価</h3>
          <div className="p-2">
            <Select
              value={minRating.toString()}
              onValueChange={(value) => setMinRating(Number(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <Link href="/?rating=0" passHref legacyBehavior>
                  <SelectItem value="0">すべて</SelectItem>
                </Link>
                <Link href="/?rating=1" passHref legacyBehavior>
                  <SelectItem value="1">★1以上</SelectItem>
                </Link>
                <Link href="/?rating=2" passHref legacyBehavior>
                  <SelectItem value="2">★2以上</SelectItem>
                </Link>
                <Link href="/?rating=3" passHref legacyBehavior>
                  <SelectItem value="3">★3以上</SelectItem>
                </Link>
                <Link href="/?rating=4" passHref legacyBehavior>
                  <SelectItem value="4">★4以上</SelectItem>
                </Link>
                <Link href="/?rating=5" passHref legacyBehavior>
                  <SelectItem value="5">★5のみ</SelectItem>
                </Link>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    ),
    [
      selectedCategories,
      minRating,
      handleCategoryChange,
      setMinRating,
      categoriesForUI,
    ]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:h-16 gap-4">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                <a href="/" className="hover:text-gray-700 transition-colors">
                  👍
                </a>
              </h1>
            </div>
            <div className="w-full sm:flex-1 sm:max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="検索"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバー（デスクトップ） */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card className="py-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  フィルター
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1">
            {/* ツールバー */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* モバイル用フィルターボタン */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className="lg:hidden bg-transparent"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      フィルター
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>フィルター</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 px-3">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-sm text-gray-600">
                  {filteredAndSortedProducts.length}件
                </p>
              </div>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <Link href="/?sort=rating-desc" passHref legacyBehavior>
                    <SelectItem value="rating-desc">評価の高い順</SelectItem>
                  </Link>
                  <Link href="/?sort=rating-asc" passHref legacyBehavior>
                    <SelectItem value="rating-asc">評価の低い順</SelectItem>
                  </Link>
                  <Link href="/?sort=price-asc" passHref legacyBehavior>
                    <SelectItem value="price-asc">価格の安い順</SelectItem>
                  </Link>
                  <Link href="/?sort=price-desc" passHref legacyBehavior>
                    <SelectItem value="price-desc">価格の高い順</SelectItem>
                  </Link>
                </SelectContent>
              </Select>
            </div>

            {/* 商品グリッド */}
            <div className="grid grid-cols-1 min-[300px]:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-1 sm:gap-6">
              {filteredAndSortedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                >
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative">
                      <Image
                        src={product.photos[0]?.url}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover"
                      />

                      <div className="absolute top-2 left-2">
                        <div className="flex items-center -space-x-0.5 sm:gap-1 bg-black/30 text-white rounded px-2 py-1">
                          {renderStars(product.rating)}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <div className="flex flex-col gap-1">
                          {product.categories?.map((category) => (
                            <Badge
                              key={category.id}
                              variant="secondary"
                              className="bg-black/70 text-white text-[8px] sm:text-xs px-1.5 py-0.5 rounded-full truncate max-w-[40px] sm:max-w-none"
                              title={category.name}
                            >
                              <span className="sm:hidden">
                                {category.name.length > 2
                                  ? category.name.substring(0, 2)
                                  : category.name}
                              </span>
                              <span className="hidden sm:inline">
                                {category.name}
                              </span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <Badge
                          variant="secondary"
                          className="bg-black/70 text-white text-xs"
                        >
                          ¥{product.price.toLocaleString()}
                        </Badge>
                      </div>
                      {product.videoUrl && (
                        <div className="absolute bottom-2 right-2">
                          <div className="bg-black/70 text-white rounded-full p-1 sm:rounded-lg sm:px-2 sm:py-1 flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            <span className="hidden sm:inline text-xs">
                              動画あり
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-2 sm:p-4 pb-0 sm:pb-2">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-xs sm:text-sm md:text-base line-clamp-2">
                          {product.name}
                        </h3>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>

            {filteredAndSortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  条件に合う商品が見つかりませんでした。
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  検索条件を変更してお試しください。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
