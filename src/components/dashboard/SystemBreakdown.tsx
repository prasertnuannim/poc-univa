"use client";


import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement);


export default function SystemBreakdown() {
return (
<section className="card">
<h3>System Utilization Breakdown</h3>
<Bar
data={{
labels: ["Run", "Idle", "Down"],
datasets: [
{
data: [56, 20, 24],
backgroundColor: ["#4ade80", "#facc15", "#f87171"],
},
],
}}
options={{ responsive: true }}
/>
</section>
);
}