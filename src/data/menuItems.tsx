import Image from "next/image";

export const menuItems = [
  {
    name: <Image src="/favicon.ico" alt="Home" width={20} height={20} />,
    href: "/",
  },
  {
    name: "Mint",
    href: "/mint",
  },
  {
    name: "List",
    href: "/list",
  },
  {
    name: "Buy",
    href: "/buy",
  },
];
