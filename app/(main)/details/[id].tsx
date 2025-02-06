import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFood } from "../../provider/foodProvider";
import {Meal} from "../../types/meal";

export default function MealDetails() {
    const { mealId } = useLocalSearchParams();
    const { meals, removeMeal } = useFood();
    const [meal, setMeal] = useState<Meal | null>(null);

    useEffect(() => {
        if (mealId) {
            const foundMeal = meals.find((meal) => meal.id === mealId);
            setMeal(foundMeal || null);
        }
    }, [mealId, meals]);

    if (!meal) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Repas introuvable.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Repas {meal.id}</Text>
            {meal.foods.map((food) => (
                <View key={food.foodId} style={styles.foodItem}>
                    {food.image && <Image source={{ uri: food.image }} style={styles.foodImage} />}
                    <Text style={styles.foodName}>{food.label}</Text>
                    <Text>Calories: {food.nutrients.ENERC_KCAL} kcal</Text>
                </View>
            ))}
            <Text style={styles.totalCalories}>Total Calories: {meal.totalCalories} kcal</Text>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                    if (meal) {
                        removeMeal(meal.id);
                    }
                }}
            >
                <Text style={styles.deleteButtonText}>Supprimer ce repas</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    foodItem: {
        padding: 15,
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
    },
    foodImage: {
        width: "100%",
        height: 200,
        marginBottom: 10,
        borderRadius: 8,
    },
    foodName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    totalCalories: {
        fontSize: 18,
        marginTop: 20,
        fontWeight: "bold",
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        padding: 10,
        marginTop: 20,
        borderRadius: 8,
        alignItems: "center",
    },
    deleteButtonText: {
        color: "white",
        fontSize: 16,
    },
    text: {
        fontSize: 16,
        textAlign: "center",
    },
});
