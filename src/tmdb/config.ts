export function getConfig() {
  let tmdbApiKey = process.env.TMDB_API_KEY ?? '';
  tmdbApiKey = tmdbApiKey.trim();

  if (!tmdbApiKey) {
    throw new Error('Missing TMDB_API_KEY environment variable');
  }

  let proxyUrl: undefined | string = process.env.TMDB_WEB_PROXY_URL;
  proxyUrl = !proxyUrl ? undefined : proxyUrl;

  return {
    tmdbApiKey,
    proxyUrl,
  };
}
