import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

export default function Page() {
    const { user } = useUser();

    return (
        <View style={styles.container}>
            <SignedOut>
                <View style={styles.authContainer}>
                    <Link href="/(auth)/sign-in">
                        <Text style={styles.authLink}>Sign in</Text>
                    </Link>
                    <Text style={styles.separator}>  |  </Text>
                    <Link href="/(auth)/sign-up">
                        <Text style={styles.authLink}>Sign up</Text>
                    </Link>
                </View>
            </SignedOut>

            <View style={styles.content}>
                <SignedIn>
                    <Text style={styles.welcomeText}>Hello {user?.emailAddresses[0].emailAddress}</Text>
                </SignedIn>

                <Text style={styles.placeholderText}>Contenu de la page...</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    authContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 10,
    },
    authLink: {
        fontSize: 16,
        color: '#007bff',
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    separator: {
        fontSize: 16,
        color: '#333',
        marginHorizontal: 5,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    placeholderText: {
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
});
