import React from "react";
import { FlatList, Text, View } from "react-native";

/**
 * TODO: 
 * - fix: show all 7 days and not just 5
 * - fix display days from right to left for the past 7 days
 */

interface DayLog {
  day: string;
  logged: boolean;
}

const pastSevenDayLogs: DayLog[] = [
  { day: "2025-12-22", logged: true },
  { day: "2025-12-23", logged: false },
  { day: "2025-12-24", logged: true },
  { day: "2025-12-25", logged: true },
  { day: "2025-12-26", logged: false },
  { day: "2025-12-27", logged: false },
  { day: "2025-12-28", logged: true },
];

const Streak = () => {
  // Helper function to get day name from date string
  const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[date.getDay()];
  };

  const renderDayItem = ({ item }: { item: DayLog }) => {
    const dayStr = getDayName(item.day);
    return (
      <View className="flex-col items-center mx-2">
        <View
          className={`w-14 h-4 ${
            item.logged ? "bg-primary" : "bg-border"
          } rounded-full`}
        />
        <Text className="text-sm mt-2">{dayStr}</Text>
      </View>
    );
  };

  return (
    <View className="px-6">
      <FlatList
        data={pastSevenDayLogs}
        keyExtractor={(item) => item.day}
        renderItem={renderDayItem}
        horizontal
        inverted 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
};

export default Streak;
