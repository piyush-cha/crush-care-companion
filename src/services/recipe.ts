export interface RecipeItem {
  idMeal: string;
  strMeal: string;
  strSource?: string | null;
  strYoutube?: string | null;
}

export async function fetchRandomRecipe(): Promise<RecipeItem | null> {
  try {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    if (!res.ok) return null;
    const data = await res.json();
    const meal = data?.meals?.[0];
    if (!meal) return null;
    return meal as RecipeItem;
  } catch (e) {
    return null;
  }
}
