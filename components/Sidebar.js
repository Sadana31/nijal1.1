'use client';

import { Home, Gauge } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-36 min-h-screen bg-[#254852] text-white flex flex-col items-center py-10 space-y-14">
      <Link href="/shipping-bills" className="flex flex-col items-center hover:text-white-300">
        <Home size={36} />
        <span className="mt-2 text-center">Shipping Bills</span>
      </Link>
      <Link href="/irm-details" className="flex flex-col items-center hover:text-white-300">
        <Gauge size={36} />
        <span className="mt-2 text-center">IRM Details</span>
      </Link>
    </div>
  );
}
