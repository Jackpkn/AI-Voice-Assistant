import React, { useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Platform, SafeAreaView, Image } from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import Markdown from 'react-native-markdown-display';

// Update API URL configuration with WiFi IP
const API_URL = Platform.select({
    android: 'http://192.168.0.102:8000',     // Your WiFi IP
    ios: 'http://localhost:8000',             // iOS Simulator
    default: 'http://192.168.0.102:8000'      // Your WiFi IP
});
 

const micIcon = require('./assets/mic.png');  
const stopIcon = require('./assets/stop.png');  
const aiIcon = require('./assets/ai.png');      
const userIcon = require('./assets/user.png');   

export default function App() {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [transcription, setTranscription] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<string>("");

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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Voice Assistant</Text>
                {loading && (
                    <View style={styles.headerLoading}>
                        <ActivityIndicator size="small" color="#fff" />
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
                    <TouchableOpacity
                        style={[styles.recordButton, isRecording && styles.recordingButton]}
                        onPress={isRecording ? stopRecording : startRecording}
                    >
                        <Image source={isRecording ? stopIcon : micIcon} style={styles.recordButtonIcon} />
                        <Text style={styles.recordButtonText}>
                            {isRecording ? "Stop Recording" : "Start Recording"}
                        </Text>
                    </TouchableOpacity>

                    {loading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#6200ee" />
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E293B',  
    },
    header: {
        paddingTop: Platform.OS === 'ios' ? 0 : 40,
        paddingBottom: 20,
        backgroundColor: '#334155',  
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    headerLoading: {
        position: 'absolute',
        right: 20,
        top: Platform.OS === 'ios' ? 20 : 50,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: '#CBD5E1',  
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    content: {
        padding: 20,
        alignItems: 'center',
    },
    recordButton: {
        width: 220,  
        height: 70,
        borderRadius: 35,
        backgroundColor: '#4F46E5',  
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginVertical: 20,
        flexDirection: 'row',  
    },
    recordingButton: {
        backgroundColor: '#E11D48',  
    },
    recordButtonText: {
        color: '#CBD5E1', 
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10, 
    },
    recordButtonIcon: {
        width: 24,  
        height: 24,
        tintColor: '#CBD5E1', 
    },
    loadingContainer: {
        marginVertical: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#93C5FD',  
        fontSize: 16,
    },
    responseContainer: {
        width: '100%',
        padding: 15,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#334155',  
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    messageIcon: {
        width: 24,
        height: 24,
        tintColor: '#93C5FD',  
    },
    textContainer: {
        flex: 1,
        backgroundColor: '#334155',  
        borderRadius: 10,
        padding: 15,
        justifyContent: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#93C5FD',  
        marginBottom: 5,
    },
    responseText: {
        fontSize: 16,
        color: '#CBD5E1', 
        lineHeight: 24,
    },
    errorContainer: {
        backgroundColor: '#DC2626',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: '100%',
        opacity: 0.8,
    },
    errorText: {
        color: '#CBD5E1',
        fontSize: 14,
    },
    markdownBody: {
        color: '#CBD5E1',  
    },
    codeBlock: {
        backgroundColor: '#1E293B',   
        padding: 10,
        borderRadius: 5,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        color: '#93C5FD',  
        overflow: 'scroll',
    },
    codeInline: {
        backgroundColor: '#4B5563',  
        padding: 4,
        borderRadius: 3,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        color: '#93C5FD',
    },
    heading1: {
        color: '#93C5FD',
        fontSize: 24,
        marginVertical: 10,
    },
    heading2: {
        color: '#93C5FD',
        fontSize: 20,
        marginVertical: 8,
    },
    heading3: {
        color: '#93C5FD',
        fontSize: 18,
        marginVertical: 6,
    },
    paragraph: {
        color: '#CBD5E1',
        marginVertical: 4,
        lineHeight: 24,
    },
});