"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * 評価フィルターとURLパラメータの同期を行うカスタムフック
 * - SSR/CSRの違いに注意（クライアント専用）
 * - 他のクエリパラメータと競合しないようにmerge
 * - 無限ループ防止のため、minRatingの変更のみでURLを更新
 * @returns [minRating, setMinRating]
 */
export function useRatingQueryParam() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [minRating, setMinRatingState] = useState(0);
  const isInitialized = useRef(false);

  // 初期化: URLパラメータから評価をセット（一度だけ実行）
  useEffect(() => {
    // クライアントのみ
    if (typeof window === "undefined") return;
    if (isInitialized.current) return; // 初期化済みの場合はスキップ

    const ratingParam = searchParams.get("rating");
    if (ratingParam) {
      const rating = Number.parseInt(ratingParam, 10);
      if (!Number.isNaN(rating) && rating >= 0 && rating <= 5) {
        setMinRatingState(rating);
      }
    }
    isInitialized.current = true;
  }, [searchParams]);

  // minRatingの変更時にURLを同期（初期化後のみ）
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isInitialized.current) return; // 初期化前はスキップ

    const params = new URLSearchParams(searchParams.toString());
    if (minRating > 0) {
      params.set("rating", minRating.toString());
      router.replace(`/?${params.toString()}`);
    } else {
      params.delete("rating");
      router.replace(`/?${params.toString()}`);
    }
  }, [minRating, searchParams, router]);

  // 評価設定時のハンドラ
  const setMinRating = useCallback((rating: number) => {
    setMinRatingState(rating);
  }, []);

  return [minRating, setMinRating] as const;
}
