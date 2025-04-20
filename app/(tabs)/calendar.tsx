import React, { useState } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const COLORS = {
  morning: "#FF6B6B",
  afternoon: "#4ECDC4",
  night: "#6C5CE7",
};

// Helper to get days in a month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

type MedicationSchedule = {
  morning: number;
  afternoon: number;
  night: number;
};

type DayProps = {
  day: number;
  isCurrentMonth: boolean;
  date?: string;
  medications?: MedicationSchedule;
};

const sampleMedicationData: Record<string, MedicationSchedule> = {
  "2025-04-20": { morning: 2, afternoon: 1, night: 2 },
  "2025-04-21": { morning: 1, afternoon: 0, night: 1 },
  "2025-04-22": { morning: 2, afternoon: 1, night: 0 },
};

const Day = ({ day, isCurrentMonth, medications }: DayProps) => (
  <ThemedView
    style={[styles.dayContainer, !isCurrentMonth && styles.dayOutsideMonth]}
  >
    <ThemedText
      style={[styles.dayText, !isCurrentMonth && styles.dayTextOutsideMonth]}
    >
      {day}
    </ThemedText>
    {medications && (
      <View style={styles.dotsContainer}>
        {medications.morning > 0 && (
          <View style={[styles.dot, { backgroundColor: COLORS.morning }]} />
        )}
        {medications.afternoon > 0 && (
          <View style={[styles.dot, { backgroundColor: COLORS.afternoon }]} />
        )}
        {medications.night > 0 && (
          <View style={[styles.dot, { backgroundColor: COLORS.night }]} />
        )}
      </View>
    )}
  </ThemedView>
);

// List view component
const ListDayItem = ({
  date,
  medications,
}: {
  date: string;
  medications: MedicationSchedule;
}) => (
  <ThemedView style={styles.listItem}>
    <ThemedText style={styles.listDate}>
      {new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })}
    </ThemedText>
    <View style={styles.medicationTimes}>
      {medications.morning > 0 && (
        <View style={styles.timeBlock}>
          <View
            style={[styles.timeIndicator, { backgroundColor: COLORS.morning }]}
          />
          <ThemedText style={styles.timeText}>
            {medications.morning} morning
          </ThemedText>
        </View>
      )}
      {medications.afternoon > 0 && (
        <View style={styles.timeBlock}>
          <View
            style={[
              styles.timeIndicator,
              { backgroundColor: COLORS.afternoon },
            ]}
          />
          <ThemedText style={styles.timeText}>
            {medications.afternoon} afternoon
          </ThemedText>
        </View>
      )}
      {medications.night > 0 && (
        <View style={styles.timeBlock}>
          <View
            style={[styles.timeIndicator, { backgroundColor: COLORS.night }]}
          />
          <ThemedText style={styles.timeText}>
            {medications.night} night
          </ThemedText>
        </View>
      )}
    </View>
  </ThemedView>
);

export default function CalendarScreen() {
  const [currentDate] = useState(new Date("2025-04-20")); // Using the date from context
  const [viewType, setViewType] = useState<"calendar" | "list">("calendar");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Generate calendar days
  const days = [];
  const daysFromPrevMonth = firstDayOfMonth;
  const daysFromNextMonth = 42 - (daysFromPrevMonth + daysInMonth); // 42 = 6 rows × 7 days

  // Previous month days
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
    days.push({ day: i, isCurrentMonth: false });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      i
    ).padStart(2, "0")}`;
    days.push({
      day: i,
      isCurrentMonth: true,
      date,
      medications: sampleMedicationData[date] || undefined,
    });
  }

  // Next month days
  for (let i = 1; i <= daysFromNextMonth; i++) {
    days.push({ day: i, isCurrentMonth: false });
  }

  // Create sorted array of medication dates for list view
  const sortedMedicationDates = Object.entries(sampleMedicationData).sort(
    ([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()
  );

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerText}>Medication Schedule</ThemedText>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewType === "calendar" && styles.toggleButtonActive,
            ]}
            onPress={() => setViewType("calendar")}
          >
            <ThemedText
              style={[
                styles.toggleText,
                viewType === "calendar" && styles.toggleTextActive,
              ]}
            >
              Calendar
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewType === "list" && styles.toggleButtonActive,
            ]}
            onPress={() => setViewType("list")}
          >
            <ThemedText
              style={[
                styles.toggleText,
                viewType === "list" && styles.toggleTextActive,
              ]}
            >
              List
            </ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.monthText}>
          {monthName} {year}
        </ThemedText>
      </ThemedView>

      {viewType === "calendar" ? (
        <ThemedView style={styles.calendarContainer}>
          <ThemedView style={styles.weekDaysContainer}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <ThemedText key={day} style={styles.weekDayText}>
                {day}
              </ThemedText>
            ))}
          </ThemedView>

          <ThemedView style={styles.daysContainer}>
            {days.map((day, index) => (
              <Day key={index} {...day} />
            ))}
          </ThemedView>

          <ThemedView style={styles.legend}>
            <ThemedText style={styles.legendTitle}>Schedule Types:</ThemedText>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: COLORS.morning }]}
              />
              <ThemedText style={styles.legendText}>Morning</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.afternoon },
                ]}
              />
              <ThemedText style={styles.legendText}>Afternoon</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: COLORS.night }]}
              />
              <ThemedText style={styles.legendText}>Night</ThemedText>
            </View>
          </ThemedView>
        </ThemedView>
      ) : (
        <ThemedView style={styles.listContainer}>
          {sortedMedicationDates.map(([date, medications]) => (
            <ListDayItem key={date} date={date} medications={medications} />
          ))}
        </ThemedView>
      )}
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
  monthText: {
    fontSize: 18,
    marginTop: 8,
  },
  viewToggle: {
    flexDirection: "row",
    marginTop: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    padding: 4,
    borderRadius: 10,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  toggleButtonActive: {
    backgroundColor: "#0a7ea4",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  toggleTextActive: {
    color: "#fff",
  },
  calendarContainer: {
    padding: 16,
  },
  weekDaysContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
    color: "#666",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayContainer: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 4,
    alignItems: "center",
  },
  dayOutsideMonth: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dayTextOutsideMonth: {
    color: "#999",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 2,
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legend: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  listItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  listDate: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  medicationTimes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeBlock: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  timeText: {
    fontSize: 14,
  },
});
