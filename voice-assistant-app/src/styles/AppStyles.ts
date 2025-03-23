import { StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

export const createStyles = (theme: 'light' | 'dark') => {
  const themeColors = colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    header: {
      paddingTop: Platform.OS === 'ios' ? 0 : 40,
      paddingBottom: 20,
      backgroundColor: themeColors.surface,
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
      color: themeColors.text,
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
      backgroundColor: themeColors.primary,
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
      backgroundColor: themeColors.recording,
    },
    recordButtonText: {
      color: themeColors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    recordButtonIcon: {
      width: 24,
      height: 24,
      tintColor: themeColors.text,
    },
    loadingContainer: {
      marginVertical: 20,
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      color: themeColors.secondary,
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
      backgroundColor: themeColors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    messageIcon: {
      width: 24,
      height: 24,
      tintColor: themeColors.icon.primary,
    },
    textContainer: {
      flex: 1,
      backgroundColor: themeColors.surface,
      borderRadius: 10,
      padding: 15,
      justifyContent: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: themeColors.secondary,
      marginBottom: 5,
    },
    responseText: {
      fontSize: 16,
      color: themeColors.text,
      lineHeight: 24,
    },
    errorContainer: {
      backgroundColor: themeColors.error,
      padding: 10,
      borderRadius: 5,
      marginVertical: 10,
      width: '100%',
      opacity: 0.8,
    },
    errorText: {
      color: themeColors.text,
      fontSize: 14,
    },
    markdownBody: {
      color: themeColors.text,
    },
    codeBlock: {
      backgroundColor: themeColors.codeBlock.background,
      padding: 15,
      borderRadius: 8,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      color: themeColors.codeBlock.text,
      borderWidth: 1,
      borderColor: themeColors.codeBlock.border,
      overflow: 'scroll',
    },
    codeInline: {
      backgroundColor: themeColors.codeBlock.background,
      padding: 4,
      borderRadius: 4,
      fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
      color: themeColors.codeBlock.text,
    },
    heading1: {
      color: themeColors.secondary,
      fontSize: 24,
      marginVertical: 10,
      fontWeight: 'bold',
    },
    heading2: {
      color: themeColors.secondary,
      fontSize: 20,
      marginVertical: 8,
      fontWeight: 'bold',
    },
    heading3: {
      color: themeColors.secondary,
      fontSize: 18,
      marginVertical: 6,
      fontWeight: 'bold',
    },
    paragraph: {
      color: themeColors.text,
      marginVertical: 4,
      lineHeight: 24,
    },
    themeToggle: {
      position: 'absolute',
      right: 20,
      padding: 10,
    },
    themeToggleIcon: {
      width: 24,
      height: 24,
      tintColor: themeColors.icon.secondary,
    },
  });
}; 