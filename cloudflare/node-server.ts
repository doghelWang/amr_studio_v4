import { createServer } from "node:http";
import { mkdir, readFile, readdir, stat, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import worker from "./worker.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "src/frontend/dist");
const kvDir = process.env.AMR_KV_DIR || path.join(projectRoot, ".server-kv");
const port = Number(process.env.PORT || "8888");
const host = process.env.HOST || "0.0.0.0";

function encodeKey(key: string): string {
  return Buffer.from(key, "utf8").toString("base64url");
}

function decodeKey(key: string): string {
  return Buffer.from(key, "base64url").toString("utf8");
}

function keyDataPath(key: string): string {
  return path.join(kvDir, `${encodeKey(key)}.bin`);
}

function keyMetaPath(key: string): string {
  return path.join(kvDir, `${encodeKey(key)}.json`);
}

async function safeReadJson(filePath: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return undefined;
  }
}

const AMR_PROJECTS: KVNamespace = {
  async get(key: string, type?: unknown): Promise<unknown> {
    const dataPath = keyDataPath(key);
    if (!existsSync(dataPath)) {
      return null;
    }
    const bytes = await readFile(dataPath);
    if (type === "arrayBuffer") {
      return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    }
    const text = bytes.toString("utf8");
    if (type === "json") {
      return JSON.parse(text);
    }
    return text;
  },
  async put(key: string, value: unknown, options?: KVNamespacePutOptions): Promise<void> {
    await mkdir(kvDir, { recursive: true });
    let bytes: Buffer;
    if (value instanceof ArrayBuffer) {
      bytes = Buffer.from(value);
    } else if (ArrayBuffer.isView(value as ArrayBufferView)) {
      const view = value as ArrayBufferView;
      bytes = Buffer.from(view.buffer, view.byteOffset, view.byteLength);
    } else if (typeof value === "string") {
      bytes = Buffer.from(value, "utf8");
    } else {
      bytes = Buffer.from(JSON.stringify(value), "utf8");
    }
    await writeFile(keyDataPath(key), bytes);
    await writeFile(keyMetaPath(key), JSON.stringify({ metadata: options?.metadata ?? null }, null, 2));
  },
  async delete(key: string): Promise<void> {
    await Promise.allSettled([unlink(keyDataPath(key)), unlink(keyMetaPath(key))]);
  },
  async list(options?: KVNamespaceListOptions): Promise<KVNamespaceListResult<unknown, string>> {
    await mkdir(kvDir, { recursive: true });
    const files = (await readdir(kvDir)).filter((name) => name.endsWith(".bin"));
    const keys = [];
    for (const file of files) {
      const name = decodeKey(file.replace(/\.bin$/, ""));
      if (options?.prefix && !name.startsWith(options.prefix)) {
        continue;
      }
      const metadataJson = await safeReadJson(path.join(kvDir, file.replace(/\.bin$/, ".json")));
      keys.push({ name, metadata: (metadataJson as { metadata?: unknown } | undefined)?.metadata ?? null });
    }
    keys.sort((left, right) => left.name.localeCompare(right.name));
    return { keys, list_complete: true, cacheStatus: null };
  },
  getWithMetadata: async () => {
    throw new Error("KV getWithMetadata is not implemented by the local Node adapter.");
  },
} as KVNamespace;

function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".js") return "text/javascript; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".xml") return "application/xml; charset=utf-8";
  if (ext === ".ico") return "image/x-icon";
  if (ext === ".svg") return "image/svg+xml";
  return "application/octet-stream";
}

const ASSETS: Fetcher = {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const decodedPath = decodeURIComponent(url.pathname);
    const relativePath = decodedPath === "/" ? "index.html" : decodedPath.replace(/^\/+/, "");
    let filePath = path.resolve(distDir, relativePath);
    if (!filePath.startsWith(distDir) || !existsSync(filePath) || (await stat(filePath)).isDirectory()) {
      filePath = path.join(distDir, "index.html");
    }
    const body = await readFile(filePath);
    return new Response(body, {
      headers: {
        "Content-Type": contentTypeFor(filePath),
      },
    });
  },
};

createServer(async (incoming, outgoing) => {
  const chunks: Buffer[] = [];
  for await (const chunk of incoming) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const url = `http://${incoming.headers.host || `${host}:${port}`}${incoming.url || "/"}`;
  const request = new Request(url, {
    method: incoming.method,
    headers: incoming.headers as HeadersInit,
    body: chunks.length > 0 && incoming.method !== "GET" && incoming.method !== "HEAD" ? Buffer.concat(chunks) : undefined,
  });

  try {
    const response = await worker.fetch(request, { ASSETS, AMR_PROJECTS });
    outgoing.writeHead(response.status, Object.fromEntries(response.headers.entries()));
    if (incoming.method === "HEAD") {
      outgoing.end();
      return;
    }
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    outgoing.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
    outgoing.end(JSON.stringify({ error: "NODE_WORKER_ADAPTER_ERROR", detail: error instanceof Error ? error.message : String(error) }));
  }
}).listen(port, host, () => {
  console.log(`AMR Studio Worker-compatible Node server listening on http://${host}:${port}`);
});
