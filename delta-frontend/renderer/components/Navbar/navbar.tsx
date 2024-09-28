import { Button } from "../ui/button";
import Link from "next/link";
import ScreenCapture from "./screenCaptureButton";

const Navbar = () => {
  return (
    <nav className="bg-black text-white shadow-md border-purple absolute h-12 w-full top-0">
      <div className="container my-auto mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          Delta
        </Link>
        <div className="space-x-4">
          <Link href="/about">
            <Button variant="ghost">About</Button>
          </Link>
          <div>
          <ScreenCapture />
          </div>
          <Link href="/contact">
            <Button variant="ghost">Contact</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
