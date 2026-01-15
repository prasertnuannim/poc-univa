"use client";


import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);


export default function ExamTrend() {
return (
<section className="card">
<h3>Exam Volume Trend</h3>
<Line
data={{
labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
datasets: [
{
label: "Total Exams",
data: [70, 82, 90, 95, 110, 100, 47],
borderColor: "#3b82f6",
},
],
}}
/>
</section>
);
}