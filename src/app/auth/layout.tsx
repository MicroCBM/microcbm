import { Icon } from "@/libs";
import BgImage from "../../../public/assets/images/Bg.webp";
import Logo from "../../../public/assets/svg/new_logo_white.svg";
import CheckCircle from "../../../public/assets/svg/check_circle.svg";
import EndQuote from "../../../public/assets/svg/end_quote.svg";
import Link from "next/link";
import { ROUTES } from "@/utils";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <div
        style={{ backgroundImage: `url(${BgImage.src})` }}
        className="flex-1 p-10  flex-col min-h-screen hidden md:flex"
      >
        <Logo className="h-[69px] w-40" />
        <div className="text-white flex flex-col gap-10 font-medium justify-center flex-1">
          <Icon icon="mdi:format-quote-open" className="size-20 -m-4" />
          <div className="flex flex-col gap-4">
            <p className="text-xl">
              MicroCBM empowers industries to protect their critical rotating
              equipment with simple, smart, and scalable condition monitoring.
              We help firms predict failures, extend asset life, and lower
              maintenance costs.
            </p>

            <div className="flex items-center gap-2">
              <p className="text-lg">Predict. Prevent. Perform.</p>
              <CheckCircle className="size-6" />
            </div>
          </div>
          <div className="flex justify-end w-full">
            <EndQuote className="size-10" />
          </div>
        </div>
        <div className="flex justify-end gap-2 text-white items-center">
          <Link href={ROUTES.ABOUT}>About</Link>
          <span>|</span>
          <Link href={ROUTES.CONTACT}>Contact</Link>
          <span>|</span>
          <Link href={ROUTES.LINKEDIN}>LinkedIn</Link>
        </div>
      </div>
      <section className="flex-1">
        <div className="flex flex-col justify-center items-center min-h-screen">
          {children}
        </div>
      </section>
    </div>
  );
}
