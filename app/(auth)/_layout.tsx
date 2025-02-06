import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) return null; // Attendre que Clerk soit chargé

    if (isSignedIn) return <Redirect href="/" />; // Redirige si l'utilisateur est connecté

    return (
        <Stack/>
    );
}
