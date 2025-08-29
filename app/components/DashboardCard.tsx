interface DashboardCardProps {
  title: string;
  value: string | number;
}

export default function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-slate-600 font-medium">{title}</h2>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
