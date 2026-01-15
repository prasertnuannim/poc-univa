import ExamTrend from "@/components/dashboard/ExamTrend";
import KPICards from "@/components/dashboard/KPICards";
import SystemBreakdown from "@/components/dashboard/SystemBreakdown";



export default function OverviewPage() {
return (
<main className="container">
<h1>Ultrasound Utilization – Overview</h1>
<KPICards />
<SystemBreakdown />
<ExamTrend />
</main>
);
}