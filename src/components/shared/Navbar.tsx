"use client";

import React from "react";
import MicroCBMLogo from "../../../public/assets/images/Logo.png";
import Image from "next/image";
import { Button } from "../button";
import { Icon } from "@/libs";
import { QuickCreateModal } from "./QuickCreateModal";

export default function Navbar() {
  return (
    <nav className="flex fixed top-0 left-0 right-0 z-20 bg-white">
      <div className="p-[6.4px] bg-white border-r border-r-[#E5E5E5] flex items-center w-64">
        <Image
          src={MicroCBMLogo}
          alt="MicroCBM Logo"
          width={136}
          height={28}
          className="w-[136px] h-[28px] object-contain"
        />
      </div>
      <div className="py-[6.4px] pl-[27.2px] pr-[19.2px] flex justify-between items-center flex-1 border-b border-b-[#E5E5E5]">
        <p className="text-sm text-[#B3B3B3]">Recent</p>
        <QuickCreateModal>
          <Button size="medium" className="rounded-full">
            <Icon icon="mdi:plus-circle" className="text-white size-5" />
            Quick Create
          </Button>
        </QuickCreateModal>
      </div>
    </nav>
  );
}
