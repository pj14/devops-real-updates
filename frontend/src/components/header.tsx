import React from "react";
import Image from "next/image";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import logo from "../../public/logo.svg";
import RegionSelector from "./regionSelector";
import { IHeaderProps } from "@/types/headerTypes";

export default function Header(props: IHeaderProps) {
  return (
    <Navbar
      position="static"
      className="flex flex-wrap justify-between p-3 w-[100%] [&>header]:max-w-[90%]"
    >
      <NavbarBrand className="flex flex-wrap items-center justify-around">
        <Image
          className="object-contain w-[30%] p-2"
          priority
          src={logo}
          alt="Logo"
        />
        <p className="text-2xl font-bold text-inherit text-gray-700">
          Devops Monitoring System
        </p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <RegionSelector region={props.region} setRegion={props.setRegion} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
