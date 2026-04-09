import localFont from "next/font/local";

export const dsaaSans = localFont({
  src: [
    {
      path: "./fonts/BricolageGrotesque-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/BricolageGrotesque-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

export const dsaaMono = localFont({
  src: [{ path: "./fonts/DMMono-Regular.ttf", weight: "400", style: "normal" }],
  variable: "--font-mono",
  display: "swap",
});
