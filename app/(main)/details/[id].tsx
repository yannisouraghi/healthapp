import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useFood } from "../../provider/foodProvider";
import { Meal } from "../../types/meal";

export default function MealDetails() {
    const { id } = useLocalSearchParams();
    const { meals, removeMeal } = useFood();
    const [meal, setMeal] = useState<Meal | null>(null);

    useEffect(() => {
        if (id) {
            const foundMeal = meals.find((meal) => meal.id === id);
            setMeal(foundMeal || null);
        }
    }, [id, meals]);

    if (!meal) {
        return (
            <View style={styles.container}>
                <Text style={styles.notFoundText}>Repas introuvable.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}> {meal.id}</Text>
            {meal.foods.map((food) => (
                <View key={food.foodId} style={styles.foodItem}>
                    {food.image && <Image source={{ uri: food.image }} style={styles.foodImage} />}
                    <Text style={styles.foodName}>{food.label}</Text>
                    <Text style={styles.caloriesText}>Calories: {food.nutrients.ENERC_KCAL} kcal</Text>
                </View>
            ))}
            <Text style={styles.totalCalories}>Total Calories: {meal.totalCalories} kcal</Text>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeMeal(meal.id)}
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
        backgroundColor: "#FAFAFA",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
        color: "#333",
    },
    foodGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    foodItem: {
        width: "48%", // Deux items par ligne
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Ombre Android
    },
    foodImage: {
        width: "100%",
        height: 100,
        borderRadius: 8,
        marginBottom: 8,
    },
    foodName: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        color: "#444",
    },
    calories: {
        fontSize: 14,
        textAlign: "center",
        color: "#777",
    },
    totalCalories: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 15,
        color: "#222",
    },
    deleteButton: {
        backgroundColor: "#E63946",
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
        alignSelf: "center",
        width: "100%",
    },
    deleteButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});

