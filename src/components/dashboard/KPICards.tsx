"use client";

import { mockOverview } from "@/mock/overview";



export default function KPICards() {
const { utilization, exams, avgDuration, downtime } = mockOverview;


return (
<section className="grid">
<div className="card">Utilization<br /><b>{utilization}%</b></div>
<div className="card">Total Exams<br /><b>{exams}</b></div>
<div className="card">Avg Duration<br /><b>{avgDuration} min</b></div>
<div className="card">Downtime<br /><b>{downtime} hrs</b></div>
</section>
);
}