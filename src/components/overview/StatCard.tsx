type Props = {
  title: string;
  value: string | number;
  delta?: string;
  negative?: boolean;
};

export default function StatCard({
  title,
  value,
  delta,
  negative,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-3xl font-semibold">{value}</div>

      {delta && (
        <div
          className={`mt-1 text-sm ${
            negative ? "text-red-500" : "text-green-500"
          }`}
        >
          {delta} from last day
        </div>
      )}
    </div>
  );
}
