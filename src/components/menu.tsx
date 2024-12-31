"use client";

import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { menuItems } from "@/data/menuItems";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Menu() {
  const pathname = usePathname();

  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
      {menuItems.map((item, index) => (
        <MenubarMenu key={index}>
          <Link href={item.href} key={item.href}>
            <MenubarTrigger
              data-active={pathname?.startsWith(item.href) ?? false}
            >
              {item.name}
            </MenubarTrigger>
          </Link>
        </MenubarMenu>
      ))}
    </Menubar>
  );
}
