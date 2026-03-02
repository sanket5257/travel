interface Props {
  status: "pending" | "confirmed" | "cancelled";
}

export default function StatusBadge({ status }: Props) {
  const styles = {
    pending: "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20",
    confirmed: "bg-green-50 text-green-700 ring-1 ring-green-600/20",
    cancelled: "bg-red-50 text-red-700 ring-1 ring-red-600/20",
  };

  const dotStyles = {
    pending: "bg-yellow-500",
    confirmed: "bg-green-500",
    cancelled: "bg-red-500",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotStyles[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
