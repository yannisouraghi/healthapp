import { useState, useEffect } from "react";
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useFood } from "../provider/foodProvider";
import { Entypo } from "react-native-vector-icons";
import {Meal} from "../types/meal";

export default function IndexPage() {
    const { meals } = useFood();
    const router = useRouter();

    const renderMealItem = ({ item }: { item: Meal }) => (
        <View style={styles.mealItem}>
            <Text style={styles.mealTitle}> {item.id}</Text>
            <FlatList
                data={item.foods}
                keyExtractor={(food) => food.foodId}
                renderItem={({ item }) => (
                    <Text>{item.label} - {item.nutrients.ENERC_KCAL} kcal</Text>
                )}
            />
            <Text style={styles.totalCalories}>Total Calories: {item.totalCalories} kcal</Text>

            <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => router.push(`/details/${item.id}`)}
            >
                <Text style={styles.detailsButtonText}>Voir les détails</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={meals}
                keyExtractor={(meal) => meal.id}
                renderItem={renderMealItem}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/add")}
            >
                <Text style={styles.addButtonText}>Ajouter un repas</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.profileButton}
                onPress={() => router.push("/profile")}
            >
                <Entypo name="user" size={30} color="black" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    mealItem: {
        padding: 15,
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 8,
        elevation: 2,
    },
    mealTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    totalCalories: {
        fontSize: 16,
        marginTop: 10,
    },
    addButton: {
        backgroundColor: "#007BFF",
        padding: 15,
        borderRadius: 10,
        position: "absolute",
        bottom: 20,
        left: "10%",
        right: "10%",
        alignItems: "center",
    },
    addButtonText: {
        color: "white",
        fontSize: 16,
    },
    profileButton: {
        position: "absolute",
        top: 20,
        right: 20,
        backgroundColor: "#f5f5f5",
        padding: 10,
        borderRadius: 25,
        elevation: 5,
    },
    detailsButton: {
        backgroundColor: "#28a745",
        padding: 10,
        marginTop: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    detailsButtonText: {
        color: "white",
        fontSize: 16,
    },
});
