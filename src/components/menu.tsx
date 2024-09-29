import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Image from "next/image";
import Link from "next/link";

export function Menu() {
  return (
    <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
      <MenubarMenu>
        <Link href="/" passHref>
          <MenubarTrigger className="font-bold">
            <Image src="/favicon.ico" alt="Home" width={20} height={20} />
          </MenubarTrigger>
        </Link>
      </MenubarMenu>
    </Menubar>
  );
}
