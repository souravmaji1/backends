import Link from "next/link";
import React from "react";

const NftItemBox = ({ item }: any) => {
  return (
    <div className="rounded-lg bg-dark border-1 border-gray-500 p-10 h-full">
      <div className="flex h-full w-full">
        <div>
          <img
            src={process.env.NEXT_PUBLIC_API_URL + item.photo}
            alt="img"
            className="w-32 h-32"
          />
        </div>
        <div className="flex flex-col justify-between !h-full px-6 w-3/4">
          <h4 className="font-black text-lg">{item.name}</h4>
          <Link
            href="/dashboard"
            className="w-3/4 bg-heading py-2 flex items-center justify-center rounded-lg outline-2 outline-dashed outline-heading outline-offset-2 transition-all duration-300 hover:outline"
          >
            <h1 className="font-semibold text-dark text-sm">Buy</h1>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NftItemBox;
