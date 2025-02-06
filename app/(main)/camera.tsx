import { CameraView, CameraType, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFood } from '../provider/foodProvider';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const { addFood } = useFood();
    const appId = process.env.APP_ID;
    const appKey = process.env.APP_KEY;

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const handleBarcodeScanned = async (result: BarcodeScanningResult) => {
        if (scanned) return;

        setScanned(true);
        const barcode = result.data;
        console.log("Scanned barcode:", barcode);

        try {
            const response = await fetch(
                `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${appKey}&upc=${barcode}&nutrition-type=cooking`
            );
            const data = await response.json();

            if (data.hints && data.hints.length > 0) {
                const foodData = data.hints[0].food;
                const food = {
                    foodId: foodData.foodId,
                    label: foodData.label,
                    brand: foodData.brand ?? "Unknown",
                    category: foodData.category ?? "Unknown",
                    nutrients: foodData.nutrients,
                    image: foodData.image ?? "",
                    quantity: 1,
                };

                await addFood(food.label);
                console.log("Produit ajouté :", food);
            } else {
                console.log("Aucun produit trouvé pour ce code-barres.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des informations du produit :", error);
        }

        setTimeout(() => setScanned(false), 3000); // Réactivation du scanner après 3s
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            >
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Flip Camera</Text>
                    </TouchableOpacity>
                </View>

                {scanned && (
                    <View style={styles.scanResultContainer}>
                        <Text style={styles.text}>Code scanned! Adding product...</Text>
                    </View>
                )}
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    button: {
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    scanResultContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: -50 }],
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 10,
        borderRadius: 10,
    },
});
