"use client";
import {authClient, googleLogin} from "@/lib/auth-client";
import {LogIn, LogOut} from "lucide-react";
import {useRouter} from "next/navigation";

const Navbar = () => {
  const {data: session, isPending} = authClient.useSession();
  const user = session?.user;

  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-black tracking-tighter text-white">
          PRICE<span className="text-orange-500">PULSE</span>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {isPending ? (
            <span className="loading loading-spinner loading-sm text-orange-500"></span>
          ) : user ? (
            // Show if Logged In
            <button
              onClick={handleSignOut}
              className="btn btn-sm md:btn-md btn-ghost text-gray-400 hover:text-white gap-2"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          ) : (
            // Show if Logged Out
            <button
              className="btn btn-sm md:btn-md bg-orange-600 hover:bg-orange-700 border-none text-white gap-2"
              onClick={googleLogin}
            >
              <LogIn size={18} />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
