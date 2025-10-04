import React from "react";
import LogoColored from "../../../public/assets/svg/logo_colored.svg";
import { Button } from "../button";
import { Icon } from "@/libs";

export default function Navbar() {
  return (
    <nav className="flex">
      <div className="p-[6.4px] bg-white-50 border-r border-r-[#E5E5E5] flex items-center max-w-[203.8px] w-full">
        <LogoColored className="w-[136px] h-[28px]" />
      </div>
      <div className="py-[6.4px] pl-[27.2px] pr-[19.2px] flex justify-between items-center w-full border-b border-b-[#E5E5E5]">
        <p className="text-sm text-[#B3B3B3]">Recent</p>
        <Button size="medium" className="rounded-full">
          <Icon icon="mdi:plus-circle" className="text-white size-5" />
          Quick Create
        </Button>
      </div>
    </nav>
  );
}
