import Link from "next/link";

function Navbar() {
  return (
    <div className="flex justify-between p-2 border-b-2">
      <ul className="flex p-4">
        <li className="p-2">
          <Link href="/" className="hover:text-gray-500">Home</Link>
        </li>
        <li className="p-2">
          <Link href="/work-input" className="hover:text-gray-500">input</Link>
        </li>
        <li className="p-2">
          <Link href="/work-json" className="hover:text-gray-500">json</Link>
        </li>
      </ul>
      <ul className="flex p-4">
      <li className="p-2">
          <Link href="/signin" className="hover:text-gray-500">Sign In</Link>
        </li>
        <li className="p-2">
          <Link href="/signup" className="hover:text-gray-500">Sign up</Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
