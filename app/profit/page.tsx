"use client";

import { useState, useEffect } from "react";

export default function CommissionPage() {
  const [shopId, setShopId] = useState("");
  const [commissionRate, setCommissionRate] = useState(0.1); // default 10%
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = "https://gojoapi.onrender.com"; // replace with your API

  // Load shopId from localStorage
  useEffect(() => {
    const storedShopId = localStorage.getItem("shop_id");
    if (storedShopId) setShopId(storedShopId);
  }, []);

  const updateCommission = async () => {
    if (!shopId) {
      setMessage("Shop ID not found in localStorage");
      return;
    }

    setLoading(true);
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE}/shops/${shopId}/commission`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ commission_rate: commissionRate }),
      });

      if (!res.ok) throw new Error("Failed to update commission");

      const data = await res.json();
      setMessage(
        `Commission for shop ${data.shop_id} updated to ${data.new_commission_rate}`
      );
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update commission";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-slate-50 min-h-screen space-y-6 text-slate-800">
      <h1 className="text-2xl font-bold text-center">Set Commission Rate</h1>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium">Shop ID</label>
          <input
            type="text"
            value={shopId}
            disabled
            className="border border-slate-300 rounded px-3 py-2 bg-slate-100 cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Commission Rate (0–1)</label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.01}
            value={commissionRate}
            onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
            className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={updateCommission}
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          disabled={loading || !shopId}
        >
          {loading ? "Updating..." : "Update Commission"}
        </button>

        {message && (
          <p
            className={`text-sm ${
              message.includes("updated") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
