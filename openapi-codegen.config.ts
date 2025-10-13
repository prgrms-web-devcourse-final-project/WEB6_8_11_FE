// @ts-nocheck
import { defineConfig } from "@7nohe/openapi-react-query-codegen";

export default defineConfig({
  // OpenAPI 스펙 파일 경로
  input: "./api-specification.yaml",

  // 생성될 파일 출력 경로
  output: "./src/lib/generated",

  // HTTP 클라이언트 (axios 사용)
  client: "axios",

  // React Query 버전
  reactQueryVersion: 5,

  // 요청 함수 생성
  request: "./src/lib/api/request.ts",

  // TypeScript 타입 스키마 형식
  // 'json-schema' | 'zod' | 'form'
  schemaType: "json-schema",
});
