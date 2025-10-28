"use client";

import React from "react";
import { Button, Text } from "@/components";
import { Icon } from "@/libs";
import Link from "next/link";

export function SampleContent() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Text variant="h4" className="text-gray-900">
          Samples
        </Text>
        <Text variant="p" className="text-gray-600">
          Manage and monitor oil analysis samples
        </Text>
      </div>
      <Link href="/samples/add">
        <Button size="medium" className="rounded-full">
          <Icon icon="mdi:plus-circle" className="text-white size-5" />
          Add New Sample
        </Button>
      </Link>
    </div>
  );
}
