import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import React, { useState } from 'react';

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [emailAddress, setEmailAddress] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    const onSignUpPress = async () => {
        if (!isLoaded) return;

        try {
            await signUp.create({ emailAddress, password });
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            setPendingVerification(true);
        } catch (err: any) {
            setError(err.errors?.[0]?.message || 'Une erreur est survenue.');
        }
    };

    const onVerifyPress = async () => {
        if (!isLoaded) return;

        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({ code });

            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId });
                router.replace('/');
            } else {
                setError('Vérification incomplète.');
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.message || 'Code invalide.');
        }
    };

    return (
        <View style={styles.container}>
            {pendingVerification ? (
                <>
                    <Text style={styles.title}>Vérifiez votre email</Text>
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <TextInput
                        style={styles.input}
                        value={code}
                        placeholder="Code de vérification"
                        onChangeText={setCode}
                    />
                    <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
                        <Text style={styles.buttonText}>Vérifier</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <Text style={styles.title}>Créer un compte</Text>
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
                    <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
                        <Text style={styles.buttonText}>S'inscrire</Text>
                    </TouchableOpacity>
                </>
            )}
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
        backgroundColor: '#28A745',
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
});
