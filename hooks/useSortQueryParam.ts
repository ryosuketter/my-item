import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * ソート順とURLパラメータの同期を行うカスタムフック
 * - SSR/CSRの違いに注意（クライアント専用）
 * - 他のクエリパラメータと競合しないようにmerge
 * - 無限ループ防止のため、sortの変更のみでURLを更新
 * @param defaultSort デフォルトのソート値
 * @returns [sort, setSort]
 */
export function useSortQueryParam(defaultSort: string) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sort, setSortState] = useState(defaultSort);
  const isInitialized = useRef(false);

  // 初期化: URLパラメータからsortをセット（一度だけ実行）
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isInitialized.current) return;
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      setSortState(sortParam);
    }
    isInitialized.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // sortの変更時にURLを同期（初期化後のみ）
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isInitialized.current) return;
    const params = new URLSearchParams(searchParams.toString());
    if (sort !== defaultSort) {
      params.set("sort", sort);
      router.replace(`/?${params.toString()}`);
    } else {
      params.delete("sort");
      router.replace(`/?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, searchParams, router, defaultSort]);

  // ソート設定時のハンドラ
  const setSort = useCallback((value: string) => {
    setSortState(value);
  }, []);

  return [sort, setSort] as const;
}
