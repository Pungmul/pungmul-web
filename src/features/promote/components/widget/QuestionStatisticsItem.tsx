"use client";
import { QuestionStatistics } from "../../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { QuestionTypeBadge } from "../element/QuestionTypeBadge";

interface QuestionStatisticsItemProps {
  statistics: QuestionStatistics;
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#0088FE",
];

export function QuestionStatisticsItem({
  statistics,
}: QuestionStatisticsItemProps) {
  if (statistics.questionType === "TEXT") {
    return (
      <div className="flex flex-col gap-[16px] p-[16px] border border-grey-200 rounded-[8px] bg-background">
        <div className="flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[6px]">
            <div className="flex flex-row items-center gap-[4px]">
              <h3 className="font-semibold text-grey-800 text-[16px] lg:text-[18px]">
                Q{statistics.orderNo}. {statistics.questionLabel}
              </h3>
              {statistics.required && (
                <span className="text-red-500 text-[14px]">*</span>
              )}
            </div>
            <QuestionTypeBadge questionType={statistics.questionType} />
          </div>
          <div className="text-grey-500 text-[14px]">
            총 {statistics.totalResponses}명 응답
          </div>
        </div>
        <div className="flex flex-col gap-[8px]">
          {statistics.textAnswers.length > 0 ? (
            statistics.textAnswers.map((text, index) => (
              <div
                key={index}
                className="p-[12px] bg-grey-50 rounded-[6px] text-grey-800 text-[14px]"
              >
                {text}
              </div>
            ))
          ) : (
            <div className="text-grey-400 text-[14px] py-[12px]">
              답변이 없습니다.
            </div>
          )}
        </div>
      </div>
    );
  }

  // CHOICE, CHECKBOX 타입
  const chartData = statistics.optionStatistics.map((opt) => ({
    name: opt.optionLabel,
    value: opt.count,
    percentage: opt.percentage,
  }));

  return (
      <div className="flex flex-col gap-[16px] p-[16px] border border-grey-200 rounded-[8px] bg-background">
        <div className="flex flex-col gap-[8px]">
          <div className="flex flex-col gap-[6px]">
            <div className="flex flex-row items-center gap-[4px]">
              <h3 className="font-semibold text-grey-800 text-[16px] lg:text-[18px]">
                Q{statistics.orderNo}. {statistics.questionLabel}
              </h3>
              {statistics.required && (
                <span className="text-red-500 text-[14px]">*</span>
              )}
            </div>
            <QuestionTypeBadge questionType={statistics.questionType} />
          </div>
          <div className="text-grey-500 text-[14px]">
            총 {statistics.totalResponses}명 응답
          </div>
        </div>

      {statistics.totalResponses > 0 ? (
        <div className="flex flex-col gap-[16px]">
          {/* Bar Chart */}
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis
                  allowDecimals={false}
                  domain={[0, 'dataMax']}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${value}명 (${chartData.find((d) => d.value === value)?.percentage}%)`,
                    "응답 수",
                  ]}
                />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="응답 수">
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart (CHOICE 타입인 경우만) */}
          {statistics.questionType === "CHOICE" && (
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                      if (midAngle === undefined || innerRadius === undefined || outerRadius === undefined || cx === undefined || cy === undefined || index === undefined) {
                        return null;
                      }
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      const dataEntry = chartData[index];
                      
                      if (!dataEntry) {
                        return null;
                      }
                      
                      return (
                        <text
                          x={x}
                          y={y}
                          fill="var(--color-grey-700)"
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          fontSize={12}
                        >
                          {`${dataEntry.name}: ${dataEntry.percentage}%`}
                        </text>
                      );
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => {
                      const dataEntry = chartData.find((d) => d.value === value);
                      if (!dataEntry) {
                        return [`${value}명`, '응답 수'];
                      }
                      return [`${value}명 (${dataEntry.percentage}%)`, '응답 수'];
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* 통계 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-grey-50">
                  <th className="border border-grey-200 px-[12px] py-[8px] text-left text-[14px] font-semibold text-grey-700">
                    옵션
                  </th>
                  <th className="border border-grey-200 px-[12px] py-[8px] text-center text-[14px] font-semibold text-grey-700">
                    응답 수
                  </th>
                  <th className="border border-grey-200 px-[12px] py-[8px] text-center text-[14px] font-semibold text-grey-700">
                    비율
                  </th>
                </tr>
              </thead>
              <tbody>
                {statistics.optionStatistics.map((opt) => (
                  <tr key={opt.optionId}>
                    <td className="border border-grey-200 px-[12px] py-[8px] text-[14px] text-grey-800">
                      {opt.optionLabel}
                    </td>
                    <td className="border border-grey-200 px-[12px] py-[8px] text-[14px] text-grey-800 text-center">
                      {opt.count}명
                    </td>
                    <td className="border border-grey-200 px-[12px] py-[8px] text-[14px] text-grey-800 text-center">
                      {opt.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-grey-400 text-[14px] py-[12px]">
          응답이 없습니다.
        </div>
      )}
    </div>
  );
}

