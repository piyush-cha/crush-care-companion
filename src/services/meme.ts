export interface MemeResponse {
  url: string;
  title: string;
  postLink: string;
  author: string;
  subreddit: string;
}

export async function fetchMeme(): Promise<MemeResponse | null> {
  try {
    const res = await fetch("https://meme-api.com/gimme");
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (e) {
    return null;
  }
}
