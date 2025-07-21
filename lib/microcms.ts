import { createClient } from "microcms-js-sdk";

// 環境変数からAPIキーとサービスドメインを取得
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  throw new Error(
    "MICROCMS_SERVICE_DOMAIN または MICROCMS_API_KEY が設定されていません。"
  );
}

export const client = createClient({
  serviceDomain,
  apiKey,
});

// 商品一覧を取得
export const getProducts = async (queries = {}) => {
  return await client.getList({ endpoint: "products", queries });
};

// 商品詳細を取得（id指定）
export const getProduct = async (contentId: string, queries = {}) => {
  return await client.getListDetail({
    endpoint: "products",
    contentId,
    queries,
  });
};

// カテゴリ一覧を取得
export const getCategories = async (queries = {}) => {
  return await client.getList({ endpoint: "categories", queries });
};

// カテゴリ詳細を取得（id指定）
export const getCategory = async (contentId: string, queries = {}) => {
  return await client.getListDetail({
    endpoint: "categories",
    contentId,
    queries,
  });
};

// 企業一覧を取得
export const getCompanies = async (queries = {}) => {
  return await client.getList({ endpoint: "companies", queries });
};

// 企業詳細を取得（id指定）
export const getCompany = async (contentId: string, queries = {}) => {
  return await client.getListDetail({
    endpoint: "companies",
    contentId,
    queries,
  });
};
