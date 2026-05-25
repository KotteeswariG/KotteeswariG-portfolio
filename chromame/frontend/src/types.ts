export type Swatch = { name: string; hex: string };

export type HairRec = { name: string; hex: string; category: "natural" | "bold" };

export type Profile = {
  skinTone: "fair" | "light" | "medium" | "olive" | "tan" | "deep";
  undertone: "warm" | "cool" | "neutral";
  season: "Spring" | "Summer" | "Autumn" | "Winter";
  fitzpatrick: number;
  confidence: "low" | "medium" | "high";
  blushShades: Swatch[];
  lipColors: Swatch[];
  foundationHex: string;
  eyeshadowPalette: Swatch[];
  clothingColors: string[];
  accentColors: string[];
  avoidColors: string[];
  jewelryMetal: "gold" | "silver" | "rose gold" | "mixed";
  hairRecommendations: HairRec[];
  notes: string;
};
