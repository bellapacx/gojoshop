"use client";

import { useState, useEffect } from "react";

interface ReportData {
  date: string;
  play_count: number;
  placed_bets: number;
  awarded: number;
  net_cash: number;
  company_commission: number;
}

interface ShopReport {
  shop_id: string;
  reports: ReportData[];
}

interface ReportItem {
  date: string;
  playCount: number;
  placedBet: number;
  awarded: number;
  netCash: number;
  commission: number;
}

export default function DailyReport() {
  const [duration, setDuration] = useState<
    | "today"
    | "yesterday"
    | "week"
    | "lastWeek"
    | "month"
    | "lastMonth"
    | "custom"
  >("today");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [allReports, setAllReports] = useState<ReportData[]>([]);
  const [report, setReport] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [totals, setTotals] = useState({
    playCount: 0,
    placedBet: 0,
    awarded: 0,
    netCash: 0,
    commission: 0,
  });

  const getEthiopianDate = () => {
    const now = new Date();
    // Convert to UTC+3
    const ethiopianTime = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    return ethiopianTime;
  };

  // Update From and To dates whenever duration changes
  useEffect(() => {
    const now = getEthiopianDate(); // current Ethiopian date
    let from: Date;
    let to: Date;

    const getMonday = (date: Date) => {
      const d = new Date(date);
      const day = d.getUTCDay(); // use UTC to avoid local TZ offset
      const diff = (day === 0 ? -6 : 1) - day;
      d.setUTCDate(d.getUTCDate() + diff);
      d.setUTCHours(0, 0, 0, 0);
      return d;
    };

    switch (duration) {
      case "today":
        from = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
        );
        to = new Date(from);
        break;

      case "yesterday":
        from = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate() - 1
          )
        );
        to = new Date(from);
        break;

      case "week":
        from = getMonday(now);
        to = new Date(from);
        to.setUTCDate(to.getUTCDate() + 6);
        break;

      case "lastWeek":
        const thisMonday = getMonday(now);
        from = new Date(thisMonday);
        from.setUTCDate(from.getUTCDate() - 7);
        to = new Date(from);
        to.setUTCDate(to.getUTCDate() + 6);
        break;

      case "month":
        from = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
        to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
        break;

      case "lastMonth":
        from = new Date(
          Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)
        );
        to = new Date(
          Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 0)
        );
        break;

      default:
        from = new Date(0);
        to = new Date();
    }

    setFromDate(from.toISOString().split("T")[0]);
    setToDate(to.toISOString().split("T")[0]);
  }, [duration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const shopId = localStorage.getItem("shop_id");
      if (!shopId) throw new Error("Shop ID not found");
      const res = await fetch(`https://gojoapi.onrender.com/reports/${shopId}`);
      const data: ShopReport = await res.json();
      setAllReports(data.reports);

      const from = new Date(fromDate);
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      const filteredReports = data.reports.filter((r) => {
        const reportDate = new Date(r.date);
        return reportDate >= from && reportDate <= to;
      });

      const reportItems: ReportItem[] = filteredReports.map((r) => ({
        date: r.date,
        playCount: r.play_count,
        placedBet: r.placed_bets,
        awarded: r.awarded,
        netCash: r.net_cash,
        commission: r.company_commission,
      }));

      const totalsCalc = reportItems.reduce(
        (acc, r) => {
          acc.playCount += r.playCount;
          acc.placedBet += r.placedBet;
          acc.awarded += r.awarded;
          acc.netCash += r.netCash;
          acc.commission += r.commission;
          return acc;
        },
        { playCount: 0, placedBet: 0, awarded: 0, netCash: 0, commission: 0 }
      );

      setReport(reportItems);
      setTotals(totalsCalc);
    } catch (err) {
      console.error(err);
      setReport([]);
      setTotals({
        playCount: 0,
        placedBet: 0,
        awarded: 0,
        netCash: 0,
        commission: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-800 space-y-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center md:text-left">
        Daily Report
      </h1>

      {/* Filter Form */}
      <form
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Duration</label>
          <select
            value={duration}
            onChange={(e) =>
              setDuration(
                e.target.value as
                  | "today"
                  | "yesterday"
                  | "week"
                  | "lastWeek"
                  | "month"
                  | "lastMonth"
                  | "custom"
              )
            }
            className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="lastWeek">Last Week</option>
            <option value="month">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm"
          />
        </div>

        <div className="flex  sm:col-span-2 md:col-span-1">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition w-full sm:w-auto text-sm font-medium"
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>

      {/* Table code stays the same */}
      {/* ... */}
      {/* Single Responsive Table (swipeable + sticky header) */}
      <div className="overflow-x-auto border border-slate-300 rounded-lg bg-white shadow-md">
        <table className="min-w-[700px] w-full text-sm text-left text-slate-700">
          <thead className="bg-slate-100 sticky top-0 z-10">
            <tr>
              {[
                "Date",
                "Play Count",
                "Placed Bet",
                "Awarded",
                "Net Cash",
                "Commission",
              ].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap text-xs sm:text-sm border-b"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {report.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-slate-500 text-sm"
                >
                  No data available
                </td>
              </tr>
            ) : (
              <>
                {report.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-4 py-3 whitespace-nowrap">{item.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.playCount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.placedBet}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.awarded}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.netCash}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {item.commission}
                    </td>
                  </tr>
                ))}

                {/* Totals Row */}
                <tr className="bg-indigo-50 font-bold">
                  <td className="px-4 py-3 whitespace-nowrap">Totals</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {totals.playCount}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {totals.placedBet}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {totals.awarded}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {totals.netCash}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {totals.commission}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
