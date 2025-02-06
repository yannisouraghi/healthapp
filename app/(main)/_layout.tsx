import {Redirect, Stack, useRouter} from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

export default function MainLayout() {
    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    if (!isSignedIn) return <Redirect href="/sign-in" />;

    if (!isLoaded) return null;

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ title: "Accueil" }} />
            <Stack.Screen name="add" options={{ title: "Ajouter un repas" }} />
            <Stack.Screen name="profile" options={{ title: "Profil" }} />
        </Stack>
    );
}
