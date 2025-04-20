import React from "react";
import { StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol, type IconSymbolName } from "@/components/ui/IconSymbol";

type MenuItemProps = {
  icon: IconSymbolName;
  title: string;
  onPress: () => void;
};

const MenuItem = ({ icon, title, onPress }: MenuItemProps) => (
  <TouchableOpacity onPress={onPress}>
    <ThemedView style={styles.menuItem}>
      <IconSymbol name={icon} size={24} color="#666" />
      <ThemedText style={styles.menuText}>{title}</ThemedText>
      <IconSymbol name="chevron.right" size={20} color="#666" />
    </ThemedView>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerText}>Profile</ThemedText>
      </ThemedView>

      <ThemedView style={styles.profileSection}>
        <IconSymbol name="person.circle.fill" size={80} color="#666" />
        <ThemedText style={styles.userName}>John Doe</ThemedText>
      </ThemedView>

      <ThemedView style={styles.menuSection}>
        <MenuItem
          icon="bell.circle.fill"
          title="Notifications"
          onPress={() => {
            /* TODO: Implement notifications settings */
          }}
        />
        <MenuItem
          icon="clock.circle.fill"
          title="Reminder Times"
          onPress={() => {
            /* TODO: Implement reminder settings */
          }}
        />
        <MenuItem
          icon="gearshape.circle.fill"
          title="Settings"
          onPress={() => {
            /* TODO: Implement settings */
          }}
        />
        <MenuItem
          icon="questionmark.circle.fill"
          title="Help & Support"
          onPress={() => {
            /* TODO: Implement help section */
          }}
        />
      </ThemedView>
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
    marginTop: 0,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileSection: {
    alignItems: "center",
    padding: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 12,
  },
  menuSection: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
});
