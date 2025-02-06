import { useClerk } from '@clerk/clerk-expo';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfilePage() {
    const { user, signOut } = useClerk();
    const router = useRouter();

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>User not logged in.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.email}>Email: {user.primaryEmailAddress?.emailAddress}</Text>

            <TouchableOpacity
                style={styles.signOutButton}
                onPress={() => {
                    signOut();
                    router.push("/sign-in");
                }}
            >
                <Text style={styles.signOutText}>Se déconnecter</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    email: {
        fontSize: 18,
        marginBottom: 20,
    },
    signOutButton: {
        backgroundColor: '#FF4C4C',
        padding: 15,
        borderRadius: 10,
    },
    signOutText: {
        color: 'white',
        fontSize: 16,
    },
    message: {
        fontSize: 18,
        color: 'gray',
    },
});
