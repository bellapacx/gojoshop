import DashboardCard from "./components/DashboardCard";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardCard title="Total Sales" value="$12,450" />
      <DashboardCard title="Active Users" value="325" />
      <DashboardCard title="Profit Margin" value="22%" />
    </div>
  );
}
