"use client";
import {useEffect, useState} from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {getPriceHistory} from "@/actions/product.action";
import {Loader2} from "lucide-react";

export default function PriceChart({id}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const history = (await getPriceHistory(id)) || [];
        const chartData = history.map((item) => ({
          date: new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          price: Number(item.price),
        }));
        setData(chartData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-orange-500/50" />
      </div>
    );

  if (data.length === 0)
    return (
      <div className="flex justify-center py-4">
        <span className="opacity-40 text-[10px] uppercase font-bold tracking-widest">
          No History Yet
        </span>
      </div>
    );

  return (
    <div className="w-full h-full min-h-[120px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minHeight={120}
        minWidth={0}
      >
        <AreaChart
          data={data}
          margin={{top: 5, right: 5, left: -25, bottom: 0}}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ffffff05"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{fontSize: 8, fill: "#6b7280"}}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={["auto", "auto"]}
            tick={{fontSize: 8, fill: "#6b7280"}}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#171717",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px",
              fontSize: "10px",
            }}
            itemStyle={{color: "#f97316"}}
          />

          <Area
            type="monotone"
            dataKey="price"
            stroke="#f97316"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#chartGradient)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
