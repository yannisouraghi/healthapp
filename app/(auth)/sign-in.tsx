import { useSignIn } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import React, { useState, useCallback } from 'react';

export default function SignInScreen() {
    const { signIn, setActive, isLoaded } = useSignIn();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const onSignInPress = useCallback(async () => {
        if (!isLoaded) return;

        try {
            const signInAttempt = await signIn.create({
                identifier: emailAddress,
                password,
            });

            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.replace('/');
            } else {
                setError('Connexion incomplète. Vérifiez vos informations.');
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.message || 'Une erreur est survenue.');
        }
    }, [isLoaded, emailAddress, password]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TextInput
                style={styles.input}
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Email"
                onChangeText={setEmailAddress}
            />
            <TextInput
                style={styles.input}
                value={password}
                placeholder="Mot de passe"
                secureTextEntry
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={onSignInPress}>
                <Text style={styles.buttonText}>Se connecter</Text>
            </TouchableOpacity>
            <View style={styles.linkContainer}>
                <Text>Pas encore de compte ? </Text>
                <Link href="/sign-up">
                    <Text style={styles.linkText}>Créer un compte</Text>
                </Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#F8F9FA',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        backgroundColor: '#FFF',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#E63946',
        textAlign: 'center',
        marginBottom: 10,
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    linkText: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
});
