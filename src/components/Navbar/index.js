import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex justify-end m-10">
      <Link
        href={"/stk/login"}
        className="text-center text-pink-600 font-bold"
      >Kurum Girişi</Link>
    </div>
  );
}
