'use client';

import { useState } from 'react';

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
  const [duration, setDuration] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [_allReports, setAllReports] = useState<ReportData[]>([]);
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
      const res = await fetch(`https://gojbingoapi.onrender.com/reports/${shopId}`);
      const data: ShopReport = await res.json();
      setAllReports(data.reports);

      const now = new Date();
      let from: Date;

      if (fromDate) {
        from = new Date(fromDate);
      } else {
        switch (duration) {
          case 'today':
            from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
          case 'week':
            const day = now.getDay();
            from = new Date(now);
            from.setDate(now.getDate() - day);
            from.setHours(0, 0, 0, 0);
            break;
          case 'month':
            from = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          default:
            from = new Date(0);
        }
      }

      const to = toDate ? new Date(toDate) : now;

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
      setTotals({ playCount: 0, placedBet: 0, awarded: 0, netCash: 0, commission: 0 });
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
        {/* ... same filter inputs as before ... */}
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value as 'today' | 'week' | 'month' | 'custom')}
            className="border border-slate-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
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

        <div className="flex justify-end sm:col-span-2 md:col-span-1">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition w-full sm:w-auto text-sm font-medium"
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </div>
      </form>

      {/* Mobile Card View */}
      <div className="space-y-4 md:hidden">
        {report.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-4">
            No data available
          </div>
        ) : (
          <>
            {report.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow p-4 border border-slate-200"
              >
                <p className="font-semibold text-slate-700">{item.date}</p>
                <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                  <span className="text-slate-500">Play Count:</span>
                  <span>{item.playCount}</span>
                  <span className="text-slate-500">Placed Bet:</span>
                  <span>{item.placedBet}</span>
                  <span className="text-slate-500">Awarded:</span>
                  <span>{item.awarded}</span>
                  <span className="text-slate-500">Net Cash:</span>
                  <span>{item.netCash}</span>
                  <span className="text-slate-500">Commission:</span>
                  <span>{item.commission}</span>
                </div>
              </div>
            ))}

            {/* Totals Card */}
            <div className="bg-indigo-50 rounded-lg shadow p-4 border border-indigo-200">
              <p className="font-bold text-indigo-700">Totals</p>
              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                <span className="text-slate-500">Play Count:</span>
                <span>{totals.playCount}</span>
                <span className="text-slate-500">Placed Bet:</span>
                <span>{totals.placedBet}</span>
                <span className="text-slate-500">Awarded:</span>
                <span>{totals.awarded}</span>
                <span className="text-slate-500">Net Cash:</span>
                <span>{totals.netCash}</span>
                <span className="text-slate-500">Commission:</span>
                <span>{totals.commission}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto border border-slate-300 rounded bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-100">
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
                  className="px-3 sm:px-4 py-2 text-left font-semibold text-slate-700 whitespace-nowrap text-xs sm:text-sm"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {report.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-4 text-center text-slate-500 text-sm"
                >
                  No data available
                </td>
              </tr>
            ) : (
              <>
                {report.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                      {item.playCount}
                    </td>
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                      {item.placedBet}
                    </td>
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                      {item.awarded}
                    </td>
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                      {item.netCash}
                    </td>
                    <td className="px-3 sm:px-4 py-2 whitespace-nowrap">
                      {item.commission}
                    </td>
                  </tr>
                ))}

                {/* Totals Row */}
                <tr className="bg-indigo-50 font-bold">
                  <td className="px-3 sm:px-4 py-2 whitespace-nowrap">Totals</td>
                  <td className="px-3 sm:px-4 py-2 whitespace-nowrap">{totals.playCount}</td>
                  <td className="px-3 sm:px-4 py-2 whitespace-nowrap">{totals.placedBet}</td>
                  <td className="px-3 sm:px-4 py-2 whitespace-nowrap">{totals.awarded}</td>
                  <td className="px-3 sm:px-4 py-2 whitespace-nowrap">{totals.netCash}</td>
                  <td className="px-3 sm:px-4 py-2 whitespace-nowrap">{totals.commission}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
