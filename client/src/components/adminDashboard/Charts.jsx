import React from 'react';
import { Chart } from 'react-google-charts';

export const GenderRatioChart = ({ male, female }) => {
  const data = [
    ["Gender", "Count"],
    ["Male", male],
    ["Female", female],
  ];

  const options = {
    pieHole: 0.7,
    colors: ['#4D44B5', '#FB7D5B'],
    legend: { position: "none" },
    pieSliceText: "none",
    backgroundColor: "transparent",
    chartArea: { width: '100%', height: '80%' },
  };

  return (
    <div className="relative">
      <Chart
        chartType="PieChart"
        width="100%"
        height="200px"
        data={data}
        options={options}
      />
      <div className="absolute bottom-0 left-0 right-0 flex justify-around text-sm">
        <div className="grid items-center">
          {/* <div className="w-3 h-3 rounded-full bg-[#4D44B5] mr-2"></div> */}
          <span className="text-[#a3a3a3]" style={{fontFamily:'Inter'}}>Male</span>
          <span className="ml-2 font-semibold">{male.toLocaleString()}</span>
        </div>
        <div className="grid items-center">
          {/* <div className="w-3 h-3 rounded-full bg-[#FB7D5B] mr-2"></div> */}
          <span className="text-[#a3a3a3]" style={{fontFamily:'Inter'}}>Female</span>
          <span className="ml-2 font-semibold">{female.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export const ActiveInactiveChart = ({ active, inactive }) => {
  const data = [
    ["Status", "Count"],
    ["Active", active],
    ["Inactive", inactive],
  ];

  const options = {
    pieHole: 0.7,
    colors: ['#4D44B5', '#FB7D5B'],
    legend: { position: "none" },
    pieSliceText: "none",
    backgroundColor: "transparent",
    chartArea: { width: '100%', height: '80%' },
  };

  return (
    <div className="relative">
      <Chart
        chartType="PieChart"
        width="100%"
        height="200px"
        data={data}
        options={options}
      />
      <div className="absolute bottom-0 left-0 right-0 flex justify-around text-sm">
        <div className="grid items-center">
          {/* <div className="w-3 h-3 rounded-full bg-[#4D44B5] mr-2"></div> */}
          <span className="text-[#a3a3a3]" style={{fontFamily:"Inter"}}>Active</span>
          <span className="ml-2 font-semibold">{active.toLocaleString()}</span>
        </div>
        <div className="grid items-center">
          {/* <div className="w-3 h-3 rounded-full bg-[#FB7D5B] mr-2"></div> */}
          <span className="text-[#a3a3a3]" style={{fontFamily:"Inter"}}>Inactive</span>
          <span className="ml-2 font-semibold">{inactive.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};