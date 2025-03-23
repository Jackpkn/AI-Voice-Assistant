import React, { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Platform, SafeAreaView, Image, TextInput } from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import Markdown from 'react-native-markdown-display';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { createStyles } from './src/styles/AppStyles';

// Import PNG images
const micIcon = require('./assets/mic.png');
const stopIcon = require('./assets/stop.png');
const aiIcon = require('./assets/ai.png');
const userIcon = require('./assets/user.png');
const sunIcon = require('./assets/sun.png');
const moonIcon = require('./assets/moon.png');
const sendIcon = require('./assets/send.png');
// Update API URL configuration with WiFi IP
const API_URL = Platform.select({
    android: 'http://192.168.0.102:8000',
    ios: 'http://localhost:8000',
    default: 'http://192.168.0.102:8000'
});

const AppContent = () => {
    const { theme, toggleTheme } = useTheme();
    const styles = createStyles(theme);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [transcription, setTranscription] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string>("");
    const [textInput, setTextInput] = useState("");
    const [inputMethod, setInputMethod] = useState<'voice' | 'text'>('voice');

    const formatResponse = (response: string) => {
        if (response.includes("```")) {
            return response;
        }
        if (response.includes("Parameters:") || response.includes("Returns:") || response.includes("Example:")) {
            return response.split("\n").map(line => {
                if (line.startsWith("Parameters:") || line.startsWith("Returns:") || line.startsWith("Example:")) {
                    return `\n### ${line}\n`;
                }
                return line;
            }).join("\n");
        }
        return response;
    };

    const startRecording = async () => {
        try {
            console.log("Requesting audio permissions...");
            await Audio.requestPermissionsAsync();
            console.log("Creating new recording...");
            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            console.log("Recording started successfully");
            setRecording(recording);
            setIsRecording(true);
            setError("");
        } catch (err: any) {
            const errorMsg = `Failed to start recording: ${err.message || 'Unknown error'}`;
            console.error(errorMsg);
            setError(errorMsg);
        }
    };

    const stopRecording = async () => {
        setLoading(true);
        setIsRecording(false);
        setError("");

        if (!recording) {
            console.log("No recording to stop");
            return;
        }

        try {
            console.log("Stopping recording...");
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            console.log("Recording URI:", uri);
            setRecording(null);

            const formData = new FormData();
            formData.append("file", {
                uri,
                name: "audio.wav",
                type: "audio/wav",
            } as any);

            console.log("Sending request to transcribe endpoint:", `${API_URL}/transcribe/`);
            const res = await axios.post(`${API_URL}/transcribe/`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("Transcription response:", res.data);
            setTranscription(res.data.transcription);

            console.log("Sending request to AI endpoint:", `${API_URL}/ask/`);
            const aiRes = await axios.post(`${API_URL}/ask/`, null, {
                params: {
                    question: res.data.transcription
                }
            });
            console.log("AI response:", aiRes.data);
            setAiResponse(formatResponse(aiRes.data.response));
        } catch (err: any) {
            const errorMsg = err.response
                ? `Server Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`
                : `Network Error: ${err.message || 'Unknown error'}`;
            console.error("Error details:", errorMsg);
            setError(errorMsg);
            setTranscription("Error transcribing audio");
            setAiResponse("Failed to get AI response");
        } finally {
            setLoading(false);
        }
    };

    const handleSendText = async () => {
        if (!textInput.trim()) return;
        
        setLoading(true);
        setError("");
        
        try {
            setTranscription(textInput);
            console.log("Sending request to AI endpoint:", `${API_URL}/ask/`);
            const aiRes = await axios.post(`${API_URL}/ask/`, null, {
                params: {
                    question: textInput
                }
            });
            console.log("AI response:", aiRes.data);
            setAiResponse(formatResponse(aiRes.data.response));
            setTextInput(""); // Clear input after sending
        } catch (err: any) {
            const errorMsg = err.response
                ? `Server Error: ${err.response.status} - ${JSON.stringify(err.response.data)}`
                : `Network Error: ${err.message || 'Unknown error'}`;
            console.error("Error details:", errorMsg);
            setError(errorMsg);
            setAiResponse("Failed to get AI response");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Voice Assistant</Text>
                <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                    <Image 
                        source={theme === 'light' ? moonIcon : sunIcon}
                        style={styles.themeToggleIcon}
                    />
                </TouchableOpacity>
                {loading && (
                    <View style={styles.headerLoading}>
                        <ActivityIndicator size="small" color={theme === 'light' ? '#4F46E5' : '#93C5FD'} />
                    </View>
                )}
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={styles.inputMethodToggle}>
                        <TouchableOpacity 
                            style={[
                                styles.toggleButton,
                                inputMethod === 'voice' && styles.toggleButtonActive
                            ]}
                            onPress={() => setInputMethod('voice')}
                        >
                            <Image source={micIcon} style={styles.toggleIcon} />
                            <Text style={styles.toggleText}>Voice</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.toggleButton,
                                inputMethod === 'text' && styles.toggleButtonActive
                            ]}
                            onPress={() => setInputMethod('text')}
                        >
                            <Text style={styles.toggleText}>Text</Text>
                        </TouchableOpacity>
                    </View>

                    {inputMethod === 'voice' ? (
                        <TouchableOpacity
                            style={[styles.recordButton, isRecording && styles.recordingButton]}
                            onPress={isRecording ? stopRecording : startRecording}
                        >
                            <Image 
                                source={isRecording ? stopIcon : micIcon}
                                style={styles.recordButtonIcon}
                            />
                            <Text style={styles.recordButtonText}>
                                {isRecording ? "Stop Recording" : "Start Recording"}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.textInputContainer}>
                            <TextInput
                                style={styles.textInput}
                                value={textInput}
                                onChangeText={setTextInput}
                                placeholder="Type your message..."
                                placeholderTextColor={theme === 'light' ? '#64748B' : '#94A3B8'}
                                multiline
                                maxLength={500}
                            />
                            <TouchableOpacity 
                                style={styles.sendButton}
                                onPress={handleSendText}
                                disabled={!textInput.trim() || loading}
                            >
                                <Image source={sendIcon} style={styles.sendIcon} />
                            </TouchableOpacity>
                        </View>
                    )}

                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme === 'light' ? '#4F46E5' : '#93C5FD'} />
                            <Text style={styles.loadingText}>Processing your request...</Text>
                        </View>
                    )}

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    <View style={styles.responseContainer}>
                        {transcription ? (
                            <View style={styles.messageContainer}>
                                <View style={styles.iconContainer}>
                                    <Image source={userIcon} style={styles.messageIcon} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.label}>You asked:</Text>
                                    <Text style={styles.responseText}>{transcription}</Text>
                                </View>
                            </View>
                        ) : null}

                        {aiResponse ? (
                            <View style={styles.messageContainer}>
                                <View style={styles.iconContainer}>
                                    <Image source={aiIcon} style={styles.messageIcon} />
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.label}>AI Response:</Text>
                                    <Markdown
                                        style={{
                                            body: styles.markdownBody,
                                            code_block: styles.codeBlock,
                                            code_inline: styles.codeInline,
                                            heading1: styles.heading1,
                                            heading2: styles.heading2,
                                            heading3: styles.heading3,
                                            paragraph: styles.paragraph,
                                        }}
                                    >
                                        {aiResponse}
                                    </Markdown>
                                </View>
                            </View>
                        ) : null}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}