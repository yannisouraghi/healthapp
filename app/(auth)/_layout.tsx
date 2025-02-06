import { Stack, Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function AuthRoutesLayout() {
    const { isSignedIn, isLoaded } = useAuth();

    if (!isLoaded) return null;

    if (isSignedIn) return <Redirect href="/" />;

    return (
        <Stack/>
    );
}
