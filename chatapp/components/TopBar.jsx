"use client";

import { Logout } from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const TopBar = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    signOut({ callbackUrl: "/" });
  };

  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="topbar">
      <Link href="/chats">
      <img 
  src="/assets/logo.png" 
  alt="logo" 
  className="logo" 
  style={{ 
    width: '80px', // Adjust the width as needed
    height: '50px', // Adjust the height as needed
    borderRadius: '150px' 
  }} 
/>
      </Link>

      <div className="menu">
      <Link
  href="/chats"
  className={`${
    pathname === "/chats" ? "bg-green-600 text-white" : "bg-red-500 text-white hover:bg-green-600"
  } text-heading4-bold px-4 py-2 rounded-lg`}
>
  Chats
</Link>
<Link
  href="/contacts"
  className={`${
    pathname === "/contacts" ? "bg-green-600 text-white" : "bg-red-500 text-white hover:bg-green-600"
  } text-heading4-bold px-4 py-2 rounded-lg`}
>
  Contacts
</Link>


        <Logout
          sx={{ color: "white", cursor: "pointer" }}
          onClick={handleLogout}
        />

        <Link href="/profile">
          <img
            src={user?.profileImage || "/assets/person.jpg"}
            alt="profile"
            className="profilePhoto"
          />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
