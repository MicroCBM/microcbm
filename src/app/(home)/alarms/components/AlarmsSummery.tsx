"use client";
import { Text } from "@/components";
import { Icon } from "@/libs";
import React from "react";

const cardData = [
  {
    id: 1,
    title: "Total Alarms",
    value: "10",
    description: "This is the total of all your alarms.",
    label: "Trending up this week",
    icon: "mdi:trending-up",
  },
  {
    id: 2,
    title: "Open Alarms",
    value: "10",
    description: "This is the total of all your open alarms.",
    label: "Trending up this week",
    icon: "mdi:trending-up",
  },
  {
    id: 3,
    title: "Overdue Alarms",
    value: "10",
    description: "This is the total of all your overdue alarms.",
    label: "Trending up this week",
    icon: "mdi:trending-up",
  },
];

export const AlarmsSummery = () => {
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cardData.map((item) => (
        <div
          key={item.id}
          className="border border-gray-100 py-[12.8px] px-[19.8px]"
        >
          <div className="flex items-center justify-between">
            <Text variant="span" className="text-gray">
              {item.title}
            </Text>
            <div className="flex items-center gap-2 border border-gray-100 px-[6.4px] py-[4.8px]">
              <Icon icon="mdi:trending-up" />
              <Text variant="span">{item.value}</Text>
            </div>
          </div>
          <Text variant="h6">{item.value}</Text>
          <div className="flex items-center gap-2 px-[6.4px] py-[4.8px]">
            <Text variant="span">{item.label}</Text>
            <Icon icon="mdi:trending-up" />
          </div>
          <Text variant="span" className="text-gray">
            {item.description}
          </Text>
        </div>
      ))}
    </section>
  );
};
