import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

const COLORS = {
  morning: "#FF6B6B", // Warm red for morning
  afternoon: "#4ECDC4", // Fresh mint green for afternoon
  night: "#6C5CE7", // Calming purple-blue for night
};

type MedicationCardProps = {
  timeOfDay: "morning" | "afternoon" | "night";
  medications: Array<{
    name: string;
    quantity: string;
    taken: boolean;
  }>;
  onMarkTaken: (index: number) => void;
};

export const MedicationCard = ({
  timeOfDay,
  medications,
  onMarkTaken,
}: MedicationCardProps) => {
  return (
    <View style={[styles.card, { backgroundColor: COLORS[timeOfDay] }]}>
      <ThemedText style={styles.timeLabel}>
        {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)}
      </ThemedText>
      {medications.map((med, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.medicationItem, med.taken && styles.takenMedication]}
          onPress={() => onMarkTaken(index)}
        >
          <ThemedText style={styles.medicationName}>{med.name}</ThemedText>
          <ThemedText style={styles.quantity}>{med.quantity}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderRadius: 25,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  medicationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.3)",
  },
  medicationName: {
    color: "white",
    fontSize: 16,
  },
  quantity: {
    color: "white",
    fontSize: 14,
  },
  takenMedication: {
    opacity: 0.5,
  },
});
