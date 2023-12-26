import dynamic from "next/dynamic";

const Header = dynamic(() => import("./DynamicHeader"), { ssr: false });

export default Header;
