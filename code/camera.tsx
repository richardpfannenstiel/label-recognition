import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import RNImageManipulator from "@oguzhnatly/react-native-image-manipulator";
import { BlurView } from "@react-native-community/blur";
import { IdentifiableImage } from "./recognizeText";

interface ComponentProps {
    dismiss: () => void
    handleImage: (image: IdentifiableImage) => void
}

const CameraView = (props: ComponentProps) => {
    const device = useCameraDevice('back');
    const camera = useRef<Camera>(null);
    const [image, setImage] = useState<string | undefined>();

    /**
     * Take a photo, temporarily save it and write its URI to the image property.
     */
    async function takePhoto() {
        // Verify the camera reference is not null.
        if (camera.current == undefined) return

        // Take a photo.
        const photo = await camera.current.takePhoto();

        // Check whether the photo was captured successfully.
        if (photo == undefined) return

        // Retrieve the resource identification and adjust the image orientation.
        const file = await fetch(`file://${photo.path}`);
        const result = await RNImageManipulator.manipulate(file.url,
            [{ rotate: 90 }, { resize: {width: photo.height, height: photo.width}} ], {});
        
        // Update preview image property.
        setImage(result.uri);
    }

    /**
     * Reset the saved image URI to retake the photo.
     */
    function retake() {
        setImage(undefined);
    }

    /**
     * If an image has been taken, pass it to the parent component and dismiss the camera view.
     */
    function use() {
        if (image == undefined) return
        props.handleImage({ uri: image });
        props.dismiss();
    }


    if (device == null) return <Text>Camera not available.</Text>
    return (
        <>
            <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={image == undefined}
            photo={true}
            />
            <View style={styles.container}>
                <View style={styles.top}>
                    <BlurView
                        style={styles.absolute}
                        blurType='light'
                        blurAmount={10}
                    />
                </View>

                <View style={styles.image}>
                    { image && (
                        <Image
                        style={styles.image}
                        source={{uri: image}}
                        />
                    )}
                    
                </View>

                <View style={styles.bottom}>
                    <BlurView
                        style={styles.absolute}
                        blurType='light'
                        blurAmount={10}
                    />
                    { image == undefined ? (
                        <View style={styles.capture}>
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={takePhoto}>
                            </TouchableOpacity>
                        </View>
                    ) :
                        <View style={styles.retake}>
                            <TouchableOpacity
                                style={styles.retakeButton}
                                onPress={retake}
                            >
                            <Text style={styles.text}>Retake</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.retakeButton}
                                onPress={use}
                            >
                            <Text style={styles.text}>Use</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    top: {
        flex: 2,
        width: '100%',
    },
    image: {
        flex: 12,
        width: '100%',
        zIndex: 100,
    },
    bottom: {
        flex: 3,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    capture: {
        borderRadius: 1000,
        width: 75,
        height: 75,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        borderRadius: 1000,
        width: '90%',
        height: '90%',
        backgroundColor: 'white',
        borderWidth: 3
    },
    retake: {
        width: '100%',
        paddingHorizontal: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    retakeButton: {
        alignItems: 'center',
        width: '25%',
        backgroundColor: 'lightgray',
        paddingVertical: 10,
        borderRadius: 15
    },
    text: {
        textAlign: 'center',
        fontSize: 18,
    },
    absolute: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
});

export default CameraView;