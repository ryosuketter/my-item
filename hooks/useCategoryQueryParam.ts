"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * カテゴリ選択とURLパラメータの同期を行うカスタムフック
 * - SSR/CSRの違いに注意（クライアント専用）
 * - 他のクエリパラメータと競合しないようにmerge
 * - 無限ループ防止のため、selectedCategoriesの変更のみでURLを更新
 * @param allCategories 有効なカテゴリ一覧
 * @returns [selectedCategories, handleCategoryChange]
 */
export function useCategoryQueryParam(allCategories: string[]) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const isInitialized = useRef(false);

  // 初期化: allCategoriesが揃ってから初期化
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isInitialized.current) return;
    if (allCategories.length === 0) return;

    const categoryParam = searchParams.get("category");
    if (categoryParam && allCategories.includes(categoryParam)) {
      setSelectedCategories([categoryParam]);
    }
    isInitialized.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, allCategories.join(",")]);

  // selectedCategoriesの変更時にURLを同期（初期化後のみ）
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isInitialized.current) return; // 初期化前はスキップ

    const params = new URLSearchParams(searchParams.toString());
    if (selectedCategories.length === 1) {
      params.set("category", selectedCategories[0]);
      router.replace(`/?${params.toString()}`);
    } else {
      params.delete("category");
      router.replace(`/?${params.toString()}`);
    }
  }, [selectedCategories, searchParams, router]);

  // カテゴリ選択時のハンドラ
  const handleCategoryChange = useCallback(
    (category: string, checked: boolean) => {
      setSelectedCategories((prev) => {
        const newCategories = checked
          ? [...prev, category]
          : prev.filter((c) => c !== category);
        return newCategories;
      });
    },
    []
  );

  return [selectedCategories, handleCategoryChange] as const;
}
