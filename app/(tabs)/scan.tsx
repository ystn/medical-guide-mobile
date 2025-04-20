import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Camera, CameraView } from "expo-camera";

interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
}

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleDoctorQRScanned = (data: string) => {
    try {
      const doctorProfile: DoctorProfile = JSON.parse(data);
      setScanned(true);
      Alert.alert(
        "Doctor Profile Scanned",
        `Do you want to share your medical profile with Dr. ${doctorProfile.name}?`,
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setScanned(false),
          },
          {
            text: "Share Profile",
            onPress: () => {
              // TODO: Implement secure profile sharing
              Alert.alert(
                "Profile Shared",
                `Your medical profile has been securely shared with Dr. ${doctorProfile.name}.`
              );
              setScanned(false);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Invalid QR Code",
        "This QR code is not a valid doctor profile. Please scan a valid doctor QR code.",
        [
          {
            text: "OK",
            onPress: () => setScanned(false),
          },
        ]
      );
    }
  };

  const handleBarcodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (type === "qr") {
      handleDoctorQRScanned(data);
    }
  };

  if (hasPermission === null) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Requesting camera permission...</ThemedText>
      </ThemedView>
    );
  }

  if (hasPermission === false) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>
          No access to camera. Please enable camera permissions to scan QR
          codes.
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.overlay}>
        <ThemedText style={styles.overlayText}>
          Scan a doctor's QR code to share your medical profile
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  overlay: {
    position: "absolute",
    top: "10%",
    left: 0,
    right: 0,
    padding: 16,
    alignItems: "center",
  },
  overlayText: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 16,
    borderRadius: 8,
  },
});
