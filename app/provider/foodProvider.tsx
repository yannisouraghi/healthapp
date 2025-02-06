import React, { createContext, useContext, useEffect, useState } from "react";
import { Food } from "../types/food";
import { Meal } from "../types/meal";

interface FoodContextType {
    foods: Food[];
    meals: Meal[];
    addFood: (foodName: string) => Promise<Food | null>;
    addMeal: (meal: Meal) => void;
    removeMeal: (mealId: string) => void;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export function FoodProvider({ children }: { children: React.ReactNode }) {
    const [foods, setFoods] = useState<Food[]>([]);
    const [meals, setMeals] = useState<Meal[]>([]);

    const getFoodFromApi = async (foodName: string): Promise<Food | null> => {
        try {
            const response = await fetch(
                `https://api.edamam.com/api/food-database/v2/parser?app_id=b1d981d1&app_key=0003ca806689e130e73fd532b4ddbe9f&ingr=${encodeURIComponent(foodName)}`
            );
            const data = await response.json();
            if (data.hints && data.hints.length > 0) {
                const foodData = data.hints[0].food;
                return {
                    foodId: foodData.foodId ?? "unknown",
                    label: foodData.label ?? "No Label",
                    knownAs: foodData.knownAs ?? foodData.label ?? "No Known Name",
                    nutrients: {
                        ENERC_KCAL: foodData.nutrients?.ENERC_KCAL ?? 0,
                    },
                    brand: foodData.brand ?? undefined,
                    category: foodData.category ?? "Unknown",
                    categoryLabel: foodData.categoryLabel ?? "No Category Label",
                    image: foodData.image ?? "",
                    quantity: 1,
                };
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des détails de l'aliment :", error);
        }
        return null;
    };

    const addFood = async (foodName: string): Promise<Food | null> => {
        const existingFood = foods.find(f => f.label.toLowerCase() === foodName.toLowerCase());
        if (existingFood) {
            return existingFood;
        } else {
            const food = await getFoodFromApi(foodName);
            if (food) {
                setFoods(prevFoods => [...prevFoods, food]);
                return food;
            }
        }
        return null;
    };

    const addMeal = (meal: Meal) => {
        setMeals(prevMeals => [...prevMeals, meal]);
    };

    const removeMeal = (mealId: string) => {
        setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
    };

    return (
        <FoodContext.Provider value={{ foods, meals, addFood, addMeal, removeMeal }}>
            {children}
        </FoodContext.Provider>
    );
}

export function useFood() {
    const context = useContext(FoodContext);
    if (!context) {
        throw new Error("useFood must be used within a FoodProvider");
    }
    return context;
}
