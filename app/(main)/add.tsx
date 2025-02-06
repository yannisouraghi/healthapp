import { useState, useEffect } from "react";
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFood } from "../provider/foodProvider";
import { Food } from "../types/food";
import { Meal } from "../types/meal";

export default function AddPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<string[]>([]);
    const [addedFoods, setAddedFoods] = useState<Food[]>([]);
    const [notFoundMessage, setNotFoundMessage] = useState<string | null>(null);
    const router = useRouter();
    const { addFood, addMeal } = useFood();
    const [mealCounter, setMealCounter] = useState(1);

    useEffect(() => {
        if (query.trim().length > 0) {
            fetchResults(query);
        } else {
            setResults([]);
        }
    }, [query]);

    const fetchResults = async (text: string) => {
        try {
            const response = await fetch(
                `https://api.edamam.com/auto-complete?app_id=b1d981d1&app_key=0003ca806689e130e73fd532b4ddbe9f&q=${text}`
            );
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }
    };

    const handleAddFood = async (foodName: string) => {
        if (!addedFoods.some(food => food.label.toLowerCase() === foodName.toLowerCase())) {
            const food = await addFood(foodName);
            if (food) {
                setAddedFoods(prev => [...prev, food]);
                setNotFoundMessage(null);
            } else {
                setNotFoundMessage(`Désolé, nous n'avons pas trouvé ${foodName}.`);
            }
        }
    };

    const handleFinishMeal = () => {
        const totalCalories = addedFoods.reduce((total, food) => total + (food.nutrients.ENERC_KCAL * food.quantity), 0);
        const newMeal: Meal = {
            id: `Repas ${mealCounter}`,
            foods: addedFoods,
            totalCalories: totalCalories,
        };
        setMealCounter(prev => prev + 1);
        addMeal(newMeal);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un aliment..."
                value={query}
                onChangeText={setQuery}
            />

            <FlatList
                data={results}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View style={styles.resultItem}>
                        <Text>{item}</Text>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={() => handleAddFood(item)}
                            disabled={addedFoods.includes(item)}
                        >
                            <Ionicons name="add-circle-outline" size={24} color={addedFoods.includes(item) ? "gray" : "green"} />
                        </TouchableOpacity>
                    </View>
                )}
            />

            {notFoundMessage && (
                <Text style={styles.notFoundMessage}>{notFoundMessage}</Text>
            )}

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.cameraButton]}
                    onPress={() => router.push("/camera")}
                >
                    <Ionicons name="camera" size={24} color="white" />
                    <Text style={styles.buttonText}>Scanner</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.finishButton]}
                    onPress={handleFinishMeal}
                >
                    <Ionicons name="checkmark-circle-outline" size={24} color="white" />
                    <Text style={styles.buttonText}>Terminer</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    resultItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#fff",
        marginVertical: 5,
        borderRadius: 5,
        elevation: 1,
    },
    addButton: {
        padding: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    cameraButton: {
        backgroundColor: "#28a745",
        marginRight: 10,
    },
    finishButton: {
        backgroundColor: "#007BFF",
    },
    buttonText: {
        color: "white",
        fontSize: 14,
        marginTop: 5,
    },
    notFoundMessage: {
        color: "red",
        marginTop: 10,
        textAlign: "center",
    },
});
