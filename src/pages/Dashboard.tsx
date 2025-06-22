import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartData } from 'chart.js';

import { Col, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import { SalesProportion } from '../components/SalesProportion.tsx';
import { SalesChart } from '../components/SalesChart.tsx';
import { StatisticRow } from '../components/StatisticRow.tsx';
import { LowStockItems } from '../components/LowStockItems.tsx';
import type { ChartOptions } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('1');

  const [chartData, setChartData] = useState<ChartData<'bar'>>({
    labels: [],
    datasets: [],
  });

  // Hàm lấy dữ liệu biểu đồ theo tháng
  const getChartDataByMonth = (month) => {
    const dataByMonth = {
      '1': [10, 15, 25, 35],
      '2': [20, 30, 40, 50],
      '3': [15, 25, 35, 45],
      '4': [25, 35, 45, 55],
    };
    return dataByMonth[month] || [0, 0, 0, 0];
  };

  // Cập nhật dữ liệu biểu đồ khi tháng thay đổi
  useEffect(() => {
    setChartData({
      labels: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'],
      datasets: [
        {
          label: 'Doanh thu (triệu ₫)',
          data: getChartDataByMonth(selectedMonth),
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(99, 102, 241, 0.7)',
            'rgba(99, 102, 241, 0.9)',
            'rgba(99, 102, 241, 0.6)',
          ],
          borderRadius: 6,
          barPercentage: 0.6,
          borderSkipped: false,
        },
      ],
    });
  }, [selectedMonth]);

 
  const chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
          callback: (value) => `${value}M`,
        },
        grid: {
        
          color: '#e5e7eb',
        },
      },
      x: {
        grid: {
          
          display: false,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#4f46e5',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        cornerRadius: 4,
      },
    },
  };

  return (
    

    
    <section>
      <a
        href="https://analytics.google.com/analytics/web/#/p11386930547/reports/intelligenthome"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button>Xem phân tích người dùng</button>
      </a>

      <Title level={3}>Dashboard</Title>
      <Row gutter={[20, 20]}>
        <StatisticRow />
        <Col span={24}>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">
                Biểu đồ cột - Doanh thu theo tuần
              </h2>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="py-2 px-3 border border-gray-300 rounded-md text-sm font-semibold"
              >
                <option value="1">Tháng 1</option>
                <option value="2">Tháng 2</option>
                <option value="3">Tháng 3</option>
                <option value="4">Tháng 4</option>
              </select>
            </div>
            {chartData.labels?.length && chartData.datasets?.length && (
              <Bar data={chartData} options={chartOptions} />
            )}
          </div>
        </Col>
        <Col span={12}>
          <SalesProportion />
        </Col>
        <Col span={12}>
          <LowStockItems />
        </Col>
      </Row>
    </section>
  );
};

export default Dashboard;

