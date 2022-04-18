import { Fetch } from "./types";

const cacheMap = new Map();

function hasCache(key: string): boolean {
  return cacheMap.has(key);
}

function getCache(key: string): string {
  return cacheMap.get(key);
}

async function addCache(value: string, fetch: Fetch): Promise<string> {
  const res = await fetch(value);
  const resBlob = await res.blob();
  const blobUrl = URL.createObjectURL(resBlob);
  cacheMap.set(value, blobUrl);
  return blobUrl;
}

export { hasCache, getCache, addCache };
