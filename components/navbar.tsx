import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useWalletSelector } from "@near-wallet-selector/react-hook";

export const Navbar = () => {
  const { signedAccountId, signIn, signOut } = useWalletSelector();
  const [action, setAction] = useState<(() => void) | null>(null);
  const [label, setLabel] = useState("Loading...");

  useEffect(() => {
    if (signedAccountId) {
      setAction(() => signOut);
      setLabel(`Logout ${signedAccountId}`);
    } else {
      setAction(() => signIn);
      setLabel("Login");
    }
  }, [signedAccountId, signIn, signOut]);

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          <NavbarItem key={"/"}>
            <NextLink
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium",
              )}
              color="foreground"
              href={"/"}
            >
              Home
            </NextLink>
          </NavbarItem>
        </div>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden md:flex">
          <Button
            className="text-sm font-normal text-white bg-primary"
            variant="solid"
            onClick={action || undefined}
          >
            {label}
          </Button>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent className="sm:hidden pl-4" justify="end">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <NavbarItem>
            <NextLink
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium",
              )}
              color="foreground"
              href="/"
            >
              Home
            </NextLink>
          </NavbarItem>
          <Button
            className="text-sm font-normal text-white bg-primary"
            variant="solid"
            onPress={action || undefined}
          >
            {label}
          </Button>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
