"use client";

import { useState } from "react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const shopId = localStorage.getItem("shop_id");
      if (!shopId) throw new Error("Shop ID not found");
      const res = await fetch(`https://gojoapi.onrender.com/reports/${shopId}`);
      const data: ShopReport = await res.json();
      setAllReports(data.reports);

      const now = new Date();
      let from: Date;

      if (fromDate) {
        from = new Date(fromDate);
      } else {
        switch (duration) {
          case "today":
            from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case "yesterday":
            from = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() - 1
            );
            break;
          case "week":
            const day = now.getDay();
            from = new Date(now);
            from.setDate(now.getDate() - day);
            from.setHours(0, 0, 0, 0);
            break;
          case "lastWeek":
            const lastWeekStart = new Date(now);
            lastWeekStart.setDate(now.getDate() - now.getDay() - 7);
            from = new Date(
              lastWeekStart.getFullYear(),
              lastWeekStart.getMonth(),
              lastWeekStart.getDate()
            );
            break;
          case "month":
            from = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case "lastMonth":
            const lastMonth = new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              1
            );
            from = lastMonth;
            break;
          default:
            from = new Date(0);
        }
      }

      const to = toDate
        ? new Date(toDate)
        : (() => {
            switch (duration) {
              case "yesterday":
                const y = new Date(
                  now.getFullYear(),
                  now.getMonth(),
                  now.getDate() - 1
                );
                y.setHours(23, 59, 59, 999);
                return y;
              case "lastWeek":
                const lwEnd = new Date(from);
                lwEnd.setDate(lwEnd.getDate() + 6);
                lwEnd.setHours(23, 59, 59, 999);
                return lwEnd;
              case "lastMonth":
                const lmEnd = new Date(
                  from.getFullYear(),
                  from.getMonth() + 1,
                  0
                );
                lmEnd.setHours(23, 59, 59, 999);
                return lmEnd;
              default:
                return now;
            }
          })();

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

      // Calculate totals
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

        {/* From / To inputs for custom */}
        {duration === "custom" && (
          <>
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
          </>
        )}

        <div className="flex justify-end sm:col-span-2 md:col-span-1">
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
