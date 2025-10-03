import { Icon as IconifyIcon } from "@iconify/react";
import { isTesting } from "../utils";

const DummyIcon = () => null;
const Icon = isTesting ? DummyIcon : IconifyIcon;

export { Icon };
