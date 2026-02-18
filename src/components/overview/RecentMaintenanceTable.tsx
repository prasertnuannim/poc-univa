type RecentMaintenanceTableProps = {
  data: { date: string; device: string; details: string }[];
};

export default function RecentMaintenanceTable({
  data,
}: RecentMaintenanceTableProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <h3 className="mb-4 font-semibold">
        Recent 5 maintenance records
      </h3>

      <table className="w-full text-sm">
        <thead className="text-gray-500">
          <tr>
            <th className="text-left py-2">Date</th>
            <th className="text-left">Device</th>
            <th className="text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t">
              <td className="py-2">{row.date}</td>
              <td>{row.device}</td>
              <td>{row.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
