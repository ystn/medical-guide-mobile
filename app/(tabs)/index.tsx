import { StyleSheet, ScrollView, View } from "react-native";
import React, { useState } from "react";
import Constants from "expo-constants";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MedicationCard } from "@/components/MedicationCard";
import { FontAwesome } from "@expo/vector-icons";

// This would typically come from an API or local storage
const initialMedicationState = {
  morning: [
    { name: "Aspirin", quantity: "1 tablet", taken: false },
    { name: "Vitamin C", quantity: "2 tablets", taken: false },
  ],
  afternoon: [{ name: "Ibuprofen", quantity: "1 tablet", taken: false }],
  night: [
    { name: "Calcium", quantity: "1 tablet", taken: false },
    { name: "Magnesium", quantity: "1 capsule", taken: false },
  ],
};

const HealthAlert = () => (
  <View style={styles.alertContainer}>
    <View style={styles.alertIconContainer}>
      <FontAwesome name="exclamation-circle" size={24} color="#E67E22" />
    </View>
    <ThemedText style={styles.alertText}>
      Recently, a seasonal flu outbreak has been reported in your area. Stay
      protected by maintaining good hygiene and considering a flu shot.
    </ThemedText>
  </View>
);

export default function HomeScreen() {
  const [medications, setMedications] = useState(initialMedicationState);
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleMedicationTaken = (
    timeOfDay: keyof typeof medications,
    index: number
  ) => {
    setMedications((prev) => ({
      ...prev,
      [timeOfDay]: prev[timeOfDay].map((med, i) =>
        i === index ? { ...med, taken: !med.taken } : med
      ),
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <HealthAlert />
      <ThemedView style={styles.dateContainer}>
        <ThemedText style={styles.dateText}>{currentDate}</ThemedText>
      </ThemedView>

      {(Object.keys(medications) as Array<keyof typeof medications>).map(
        (timeOfDay) => (
          <MedicationCard
            key={timeOfDay}
            timeOfDay={timeOfDay}
            medications={medications[timeOfDay]}
            onMarkTaken={(index) => handleMedicationTaken(timeOfDay, index)}
          />
        )
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 16 + (Constants.statusBarHeight || 0),
  },
  dateContainer: {
    marginBottom: 20,
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  alertContainer: {
    backgroundColor: "#FDF2E9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  alertIconContainer: {
    marginRight: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: "#444",
  },
});
