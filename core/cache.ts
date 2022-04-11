const cacheMap = new Map();

function hasCache(key: string): boolean {
  return cacheMap.has(key);
}

function getCache(key: string): string {
  return cacheMap.get(key);
}

function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

async function addCache(value: string): Promise<string> {
  console.log(value);
  const res = await fetch(value);
  const resBlob = await res.blob();
  const base64 = "data:image/png;" + (await blobToBase64(resBlob));
  console.log(base64);
  cacheMap.set(value, base64);
  return base64 as unknown as string;
}

export { hasCache, getCache, addCache };
