import {
  ArtifactObject,
  ArtifactRef,
  ArtifactStore,
  assertSafeArtifactKey,
  createArtifactRef,
  decodeJsonArtifact,
  decodeTextArtifact,
  encodeJsonArtifact,
  encodeTextArtifact,
  PutArtifactOptions,
} from "@src/core/ports/artifact-store.ts";

export class MemoryArtifactStore implements ArtifactStore {
  private readonly objects = new Map<string, ArtifactObject>();
  private readonly maxEntries: number;

  // 默认最多保留 500 个 artifact，防止内存无限增长
  constructor(maxEntries = 500) {
    this.maxEntries = maxEntries;
  }

  async putJson<T>(
    key: string,
    value: T,
    options: PutArtifactOptions = {},
  ): Promise<ArtifactRef> {
    return await this.putBytes(key, encodeJsonArtifact(value), {
      contentType: "application/json",
      ...options,
    });
  }

  async getJson<T>(ref: ArtifactRef): Promise<T> {
    const object = await this.getObject(ref.key);
    if (!object) {
      throw new Error(`artifact 不存在: ${ref.key}`);
    }
    return decodeJsonArtifact<T>(object.body);
  }

  async putText(
    key: string,
    value: string,
    options: PutArtifactOptions = {},
  ): Promise<ArtifactRef> {
    return await this.putBytes(key, encodeTextArtifact(value), {
      contentType: "text/plain; charset=utf-8",
      ...options,
    });
  }

  async getText(ref: ArtifactRef): Promise<string> {
    const object = await this.getObject(ref.key);
    if (!object) {
      throw new Error(`artifact 不存在: ${ref.key}`);
    }
    return decodeTextArtifact(object.body);
  }

  async putBytes(
    key: string,
    value: Uint8Array,
    options: PutArtifactOptions = {},
  ): Promise<ArtifactRef> {
    assertSafeArtifactKey(key);
    // 达到上限时淘汰最旧的条目
    if (this.objects.size >= this.maxEntries) {
      const oldestKey = this.objects.keys().next().value;
      if (oldestKey !== undefined) {
        this.objects.delete(oldestKey);
      }
    }
    const ref = createArtifactRef(
      "memory",
      key,
      options.contentType ?? "application/octet-stream",
      options.label,
      value.byteLength,
    );
    this.objects.set(key, { ref, body: value });
    return ref;
  }

  async getObject(key: string): Promise<ArtifactObject | null> {
    assertSafeArtifactKey(key);
    return this.objects.get(key) ?? null;
  }

  createRunKey(runId: string, name: string, extension: string): string {
    return `runs/${runId}/${name}.${extension.replace(/^\./, "")}`;
  }
}
