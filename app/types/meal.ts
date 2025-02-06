import {Food} from "./food";

export type Meal = {
    id: string;
    foods: Food[];
    totalCalories: number;
}