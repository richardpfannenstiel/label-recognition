import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Modal, Alert, Linking, ScrollView, TouchableOpacity } from "react-native";
import { useCameraPermission } from "react-native-vision-camera";
import CameraView from "./camera";

import recognize, { IdentifiableImage } from "./recognizeText";

const App = () => {
    const [labelFields, setLabelFields] = useState<Array<string>>([]);
    const [cameraVisible, setCameraVisible] = useState(false);
    const { hasPermission, requestPermission } = useCameraPermission();
    
    /**
     * Open the camera view.
     * If not granted, request permission to access the device's camera and handle possible denial.
     */
    async function openCamera() {
        // Before opening the camera view, check the permissions.
        if (hasPermission) {
            // Permission to use the camera has already been granted.
            setCameraVisible(true);
        } else {
            // Permission is not granted, request permission if possible.
            const granted = await requestPermission();
            if (granted) {
                // Permission has been granted after requesting it.
                setCameraVisible(true);
            } else {
                // User explicitly denied permission. Cannot open the camera view.
                function showPermissionDenied() {
                    Alert.alert('Camera Access Denied', 'Scanning patient labels requires permission to access the device\'s camera.', [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'Open Settings',
                        onPress: () => { Linking.openSettings() },
                        style: 'default',
                    },
                    ])
                }
                showPermissionDenied();
            }
        }
    }

    /**
     * Dismiss the camera view.
     */
    function closeCamera() {
        setCameraVisible(false);
    }

    /**
     * Recognize text in an image.
     * The provided parameter must contain an accessible URI.
     */
    function analyzeImage(image: IdentifiableImage) {
        recognize(image).then(result => {
            setLabelFields(result);
        });
    }

    return (
        <SafeAreaView style={styles.background}>
            <Modal
                animationType="slide"
                transparent={false}
                visible={cameraVisible}
            >
                <CameraView dismiss={closeCamera} handleImage={analyzeImage}/>
            </Modal>
            <View style={styles.titleSection}>
                <Text style={styles.title}>
                    Patient Label Scan Demo
                </Text>
            </View>
            <View style={styles.middleSection}>
                <ScrollView contentContainerStyle={styles.labelSection}>
                    {labelFields.map(label => {
                        return <View style={styles.label}>
                            <Text key={labelFields.indexOf(label)-1} style={styles.text}>{label}</Text>
                        </View>
                            
                    })}
                </ScrollView>
            </View>
            
            <View style={styles.buttonSection}>
                <TouchableOpacity style={styles.button} onPress={openCamera}>
                    <Text style={styles.text}>{labelFields.length != 0 ? 'Retry' : 'Scan Label'}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'white',
        flex: 1,
    },
    titleSection: {
        justifyContent: 'center',
        flex: 1,
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
    },
    middleSection: {
        flex: 4
    },
    labelSection: {
        alignItems: 'center',
    },
    label: {
        width: '80%',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderRadius: 15,
        margin: 5,
        padding: 10,
    },
    text: {
        fontSize: 18,
    },
    buttonSection: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    button: {
        alignItems: 'center',
        width: '50%',
        backgroundColor: 'lightgray',
        paddingVertical: 10,
        borderRadius: 15
    }
});

export default App;