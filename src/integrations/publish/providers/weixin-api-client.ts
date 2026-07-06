import {
  classifyHttpProviderError,
  ProviderError,
  ProviderErrorKind,
} from "@src/core/errors/provider-error.ts";
import { redactSensitiveText } from "@src/utils/security/redact.ts";

export interface WeixinAccessTokenResponse {
  access_token: string;
  expires_in: number;
}

export interface WeixinApiClientOptions {
  baseUrl?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

interface WeixinErrorResponse {
  errcode?: number;
  errmsg?: string;
}

export class WeixinApiClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: WeixinApiClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? "https://api.weixin.qq.com";
    this.timeoutMs = options.timeoutMs ?? 30000;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async getAccessToken(
    appId: string,
    appSecret: string,
  ): Promise<WeixinAccessTokenResponse> {
    const url = new URL("/cgi-bin/token", this.baseUrl);
    url.searchParams.set("grant_type", "client_credential");
    url.searchParams.set("appid", appId);
    url.searchParams.set("secret", appSecret);
    const result = await this.requestJson<WeixinAccessTokenResponse>(url, {
      method: "GET",
    });
    validateWeixinFields(result, ["access_token", "expires_in"]);
    return result;
  }

  async postJson<T>(
    path: string,
    accessToken: string,
    body: unknown,
  ): Promise<T> {
    const url = this.createTokenUrl(path, accessToken);
    return await this.requestJson<T>(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  async postForm<T>(
    path: string,
    accessToken: string,
    formData: FormData,
    params: Record<string, string> = {},
  ): Promise<T> {
    const url = this.createTokenUrl(path, accessToken);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
    return await this.requestJson<T>(url, {
      method: "POST",
      headers: { Accept: "*/*" },
      body: formData,
    });
  }

  private createTokenUrl(path: string, accessToken: string): URL {
    const url = new URL(path, this.baseUrl);
    url.searchParams.set("access_token", accessToken);
    return url;
  }

  private async requestJson<T>(
    url: URL,
    init: RequestInit,
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetchImpl(url.href, {
        ...init,
        signal: controller.signal,
      });
      const text = await response.text();
      const payload = parseJsonResponse(text, url);

      if (!response.ok) {
        // Check if the response body contains a weixin errcode with more detail
        const errorPayload = payload as WeixinErrorResponse;
        if (errorPayload.errcode) {
          throw new ProviderError({
            provider: "weixin",
            kind: classifyWeixinError(errorPayload.errcode),
            message: `微信 API 错误 ${errorPayload.errcode}: ${
              errorPayload.errmsg ?? "unknown error"
            }`,
          });
        }
        throw classifyHttpProviderError(
          "weixin",
          response.status,
          `微信 API 请求失败: HTTP ${response.status} ${
            redactSensitiveText(url.href)
          }`,
        );
      }

      const weixinError = payload as WeixinErrorResponse;
      if (weixinError.errcode !== undefined && weixinError.errcode !== 0) {
        throw new ProviderError({
          provider: "weixin",
          kind: classifyWeixinError(weixinError.errcode),
          message: redactSensitiveText(
            `微信 API 错误 ${weixinError.errcode}: ${
              weixinError.errmsg ?? "unknown error"
            }`,
          ),
        });
      }
      if (typeof payload !== "object" || payload === null) {
        throw new ProviderError({
          provider: "weixin",
          kind: "invalid_response",
          message: `微信 API 返回无效数据类型`,
        });
      }
      return payload as T;
    } catch (error) {
      if (error instanceof ProviderError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new ProviderError({
          provider: "weixin",
          kind: "timeout",
          message: `微信 API 请求超时: ${redactSensitiveText(url.href)}`,
          cause: error,
        });
      }
      throw new ProviderError({
        provider: "weixin",
        kind: "network",
        message: redactSensitiveText(
          error instanceof Error ? error.message : String(error),
        ),
        cause: error,
      });
    } finally {
      clearTimeout(timeout);
    }
  }
}

function parseJsonResponse(text: string, url: URL): unknown {
  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    throw new ProviderError({
      provider: "weixin",
      kind: "invalid_response",
      message: `微信 API 返回非 JSON 响应: ${redactSensitiveText(url.href)}`,
      cause: error,
    });
  }
}

function classifyWeixinError(errcode: number): ProviderErrorKind {
  if ([40001, 40013, 40125, 40164, 48001].includes(errcode)) return "auth";
  if ([45009, 45011].includes(errcode)) return "rate_limit";
  if ([45008, 45028].includes(errcode)) return "quota";
  return "invalid_response";
}

function validateWeixinFields(
  payload: unknown,
  requiredFields: string[],
): void {
  if (typeof payload !== "object" || payload === null) {
    throw new ProviderError({
      provider: "weixin",
      kind: "invalid_response",
      message: `微信 API 返回无效数据类型`,
    });
  }
  const obj = payload as Record<string, unknown>;
  for (const field of requiredFields) {
    if (!(field in obj)) {
      throw new ProviderError({
        provider: "weixin",
        kind: "invalid_response",
        message: `微信 API 返回缺少必需字段: ${field}`,
      });
    }
  }
}
