"use client";

import { useState } from "react";
import EmployeeSection from "@/components/EmployeeSection";
import CouponSettingsSection from "@/components/CouponSettingsSection";
import CouponPreview from "@/components/CouponPreview";
import { EmployeeSheetGroup } from "@/types";

export default function Home() {
  const [couponGroups, setCouponGroups] = useState<EmployeeSheetGroup[]>([]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 print:p-0 print:m-0 print:max-w-none print:w-full print:space-y-0">
      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 no-print">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Employee Management</h2>
        <EmployeeSection />
      </section>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 no-print">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Coupon Settings</h2>
        <CouponSettingsSection onCouponsGenerated={setCouponGroups} />
      </section>

      <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 print:p-0 print:border-none print:shadow-none print:bg-transparent">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 no-print">Coupon Preview</h2>
        <CouponPreview groups={couponGroups} />
      </section>

      <footer className="text-center pt-12 pb-4 text-gray-400 text-sm no-print">
        FRYB Food Coupon Generator &mdash; V1
      </footer>
    </div>
  );
}
