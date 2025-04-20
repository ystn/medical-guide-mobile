import React, { useState } from "react";
import { StyleSheet, ScrollView, View, Pressable } from "react-native";
import Constants from "expo-constants";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

type Prescription = {
  date: string;
  doctorName: string;
  status: "active" | "completed" | "expired";
  medications: Array<{
    name: string;
    dosage: string;
    schedule: {
      morning: boolean;
      afternoon: boolean;
      night: boolean;
    };
    period: string;
  }>;
};

const samplePrescriptions: Prescription[] = [
  {
    date: "2025-04-20",
    doctorName: "Dr. Smith",
    status: "active",
    medications: [
      {
        name: "Amoxicillin",
        dosage: "500mg",
        schedule: {
          morning: true,
          afternoon: false,
          night: true,
        },
        period: "7 days",
      },
      {
        name: "Ibuprofen",
        dosage: "400mg",
        schedule: {
          morning: true,
          afternoon: true,
          night: true,
        },
        period: "5 days",
      },
    ],
  },
  {
    date: "2025-04-19",
    doctorName: "Dr. Williams",
    status: "active",
    medications: [
      {
        name: "Metformin",
        dosage: "850mg",
        schedule: {
          morning: true,
          afternoon: false,
          night: true,
        },
        period: "30 days",
      },
      {
        name: "Vitamin D3",
        dosage: "2000 IU",
        schedule: {
          morning: true,
          afternoon: false,
          night: false,
        },
        period: "90 days",
      },
    ],
  },
  {
    date: "2025-04-15",
    doctorName: "Dr. Johnson",
    status: "completed",
    medications: [
      {
        name: "Cetirizine",
        dosage: "10mg",
        schedule: {
          morning: true,
          afternoon: false,
          night: false,
        },
        period: "14 days",
      },
    ],
  },
  {
    date: "2025-04-10",
    doctorName: "Dr. Anderson",
    status: "expired",
    medications: [
      {
        name: "Omeprazole",
        dosage: "20mg",
        schedule: {
          morning: true,
          afternoon: false,
          night: false,
        },
        period: "30 days",
      },
      {
        name: "Ferrous Sulfate",
        dosage: "325mg",
        schedule: {
          morning: false,
          afternoon: true,
          night: false,
        },
        period: "60 days",
      },
    ],
  },
];

type FilterOption = "all" | "active" | "completed" | "expired";

const FilterButton = ({
  label,
  isSelected,
  onPress,
}: {
  label: FilterOption;
  isSelected: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
  >
    <ThemedText
      style={[
        styles.filterButtonText,
        isSelected && styles.filterButtonTextSelected,
      ]}
    >
      {label.charAt(0).toUpperCase() + label.slice(1)}
    </ThemedText>
  </Pressable>
);

const StatusChip = ({ status }: { status: Prescription["status"] }) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "#4CAF50";
      case "completed":
        return "#2196F3";
      case "expired":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <View style={[styles.statusChip, { backgroundColor: getStatusColor() }]}>
      <ThemedText style={styles.statusText}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </ThemedText>
    </View>
  );
};

const PrescriptionItem = ({ prescription }: { prescription: Prescription }) => (
  <ThemedView style={styles.prescriptionCard}>
    <View style={styles.prescriptionHeader}>
      <View>
        <ThemedText style={styles.date}>{prescription.date}</ThemedText>
        <ThemedText style={styles.doctorName}>
          {prescription.doctorName}
        </ThemedText>
      </View>
      <StatusChip status={prescription.status} />
    </View>

    <View style={styles.medicationsList}>
      {prescription.medications.map((medication, index) => (
        <View key={index} style={styles.medicationItem}>
          <ThemedText style={styles.medicationName}>
            {medication.name}
          </ThemedText>
          <ThemedText style={styles.medicationDetails}>
            Dosage: {medication.dosage}
          </ThemedText>
          <View style={styles.scheduleContainer}>
            <ThemedText style={styles.scheduleText}>Schedule:</ThemedText>
            <View style={styles.scheduleIcons}>
              {medication.schedule.morning && (
                <ThemedText style={styles.scheduleIcon}>🌅</ThemedText>
              )}
              {medication.schedule.afternoon && (
                <ThemedText style={styles.scheduleIcon}>🌞</ThemedText>
              )}
              {medication.schedule.night && (
                <ThemedText style={styles.scheduleIcon}>🌙</ThemedText>
              )}
            </View>
          </View>
          <ThemedText style={styles.period}>
            Period: {medication.period}
          </ThemedText>
        </View>
      ))}
    </View>
  </ThemedView>
);

export default function PrescriptionsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption>("all");

  const filteredPrescriptions = samplePrescriptions.filter((prescription) =>
    selectedFilter === "all" ? true : prescription.status === selectedFilter
  );

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerText}>Prescriptions</ThemedText>
        <View style={styles.filterContainer}>
          {(["all", "active", "completed", "expired"] as FilterOption[]).map(
            (filter) => (
              <FilterButton
                key={filter}
                label={filter}
                isSelected={selectedFilter === filter}
                onPress={() => setSelectedFilter(filter)}
              />
            )
          )}
        </View>
      </ThemedView>

      {filteredPrescriptions.map((prescription, index) => (
        <PrescriptionItem key={index} prescription={prescription} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 16 + (Constants.statusBarHeight || 0),
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
  },
  filterButtonSelected: {
    backgroundColor: "#2196F3",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  filterButtonTextSelected: {
    color: "#FFF",
  },
  prescriptionCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prescriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontWeight: "600",
  },
  doctorName: {
    fontSize: 14,
    marginTop: 4,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  medicationsList: {
    gap: 12,
  },
  medicationItem: {
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
  },
  medicationName: {
    fontSize: 16,
    fontWeight: "600",
  },
  medicationDetails: {
    fontSize: 14,
    marginTop: 4,
  },
  scheduleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  scheduleText: {
    fontSize: 14,
    marginRight: 8,
  },
  scheduleIcons: {
    flexDirection: "row",
    gap: 4,
  },
  scheduleIcon: {
    fontSize: 16,
  },
  period: {
    fontSize: 14,
    marginTop: 4,
  },
});
