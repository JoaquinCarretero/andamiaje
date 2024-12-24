export interface Dish {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  dietary: {
    isVegan: boolean;
    isVegetarian: boolean;
    isGlutenFree: boolean;
  };
  mealTime: string[];
}
