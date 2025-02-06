import { Redirect, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function MainLayout() {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) return null;
    if (!isSignedIn) return <Redirect href="/auth/signin" />;

    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Accueil" }} />
            <Stack.Screen name="add" options={{ title: "Ajouter un repas" }} />
        </Stack>
    );
}
