import { ToggleButtonSkeleton } from "@/components/ui/toggle-button";

export default function UserLoading() {
  return (
    <ToggleButtonSkeleton
      sidebar={<div className="w-64 bg-white border-r border-gray-100" />}
    />
  );
}
