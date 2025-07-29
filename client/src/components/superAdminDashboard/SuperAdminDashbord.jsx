import React from "react";
import { SchoolStatusChart, ExpenseChart, IncomeChart } from "./Charts";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/adminDashboard/layout/Header";
import {
  fetchSuperAdminDashboard,
  fetchSuperAdminAccounts,
} from "../../redux/superAdmin/superAdminDashboard";
import { School } from "lucide-react";
import { IoPeople } from "react-icons/io5";
// import { TbMoneybag } from "react-icons/tb";
import { LuCircleUserRound } from "react-icons/lu";

import { LiaChalkboardTeacherSolid } from "react-icons/lia";

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.superAdminDashboard.dashboard);
  // const expenseData = useSelector(
  //   (state) => state.superAdminDashboard.accounts
  // );
  const accountsCount = useSelector(
    (state) => state.superAdminDashboard.accounts.accounts
  );
  React.useEffect(() => {
    dispatch(fetchSuperAdminDashboard());
    dispatch(fetchSuperAdminAccounts());
  }, [dispatch]);

  const hasSchoolData =
    (dashboard?.activeSchools || 0) +
      (dashboard?.inActiveSchools || 0) +
      (dashboard?.suspendedSchools || 0) >
    0;
  const totalIncome =
    Array.isArray(accountsCount) && accountsCount.length > 0
      ? accountsCount.reduce(
          (sum, acc) => sum + (parseFloat(acc.paidAmount) || 0),
          0
        )
      : 0;

  return (
    <div className="pt-16 p-4">
      <Header />
      <h1 className="text-3xl text-[#146192] font-bold mb-6"> Dashboard</h1>
      <div className="bg-white max-w-6xl mb-2 ">
        <div className=" md:py-4 md:mt-6 xl:mx-auto rounded-lg grid grid-cols-2 lg:flex lg:justify-around p-4 mb-4 md:mb-0 md:mx-2 ">
          {/* Schools */}
          <div className="lg:flex gap-2">
            <div className="flex justify-center items-center">
              <div className="bg-[#303972] rounded-full p-2 text-white">
                <School className="lg:h-8 lg:w-8" />
              </div>
            </div>
            <div className="grid justify-center items-center">
              <div className="text-[#A098AE]" style={{ fontFamily: "Poppins" }}>
                Schools
              </div>
              <div className="text-center xl:text-[25px] text-[#303972] font-bold">
                {dashboard?.schools || "0"}
              </div>
            </div>
          </div>

          {/* Teachers */}
          <div className="lg:flex gap-2">
            <div className="flex justify-center items-center">
              <div className="bg-[#FB7D5B] rounded-full p-2 text-white">
                <LiaChalkboardTeacherSolid className="lg:h-8 lg:w-8" />
              </div>
            </div>
            <div className="grid justify-center items-center">
              <div className="text-[#A098AE]" style={{ fontFamily: "Poppins" }}>
                Teachers
              </div>
              <div className="text-center xl:text-[25px] text-[#303972] font-bold">
                {dashboard?.teachers || "0"}
              </div>
            </div>
          </div>

          {/* Students */}
          <div className="lg:flex gap-2">
            <div className="flex justify-center items-center">
              <div className="bg-[#4D44B5] rounded-full p-2 text-white">
                <LuCircleUserRound className="md:h-4 md:w-4 lg:h-8 lg:w-8" />
              </div>
            </div>
            <div className="grid justify-center items-center">
              <div className="text-[#A098AE]" style={{ fontFamily: "Poppins" }}>
                Students
              </div>
              <div className="text-center xl:text-[25px] text-[#303972] font-bold">
                {dashboard?.students || "0"}
              </div>
            </div>
          </div>

          {/* Parents */}
          <div className="lg:flex gap-2">
            <div className="flex justify-center items-center">
              <div className="bg-[#FCC43E] rounded-full p-2 text-white">
                <IoPeople className="lg:h-8 lg:w-8" />
              </div>
            </div>
            <div className="grid justify-center items-center">
              <div className="text-[#A098AE]" style={{ fontFamily: "Poppins" }}>
                Parents
              </div>
              <div className="text-center xl:text-[25px] text-[#303972] font-bold">
                {dashboard?.parents || "0"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {/* Income Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2
            className="text-lg font-semibold mb-3"
            style={{ fontFamily: "Inter" }}
          >
            Income
          </h2>

          <div className="h-[300px]">
            <IncomeChart accountsCount={accountsCount} />
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2
            className="text-lg font-semibold mb-3"
            style={{ fontFamily: "Inter" }}
          >
            Expenses
          </h2>
          <div className="h-[300px]">
            <ExpenseChart accountsCount={accountsCount} />
          </div>
        </div>

        {/* School Status Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2
            className="text-lg font-semibold mb-3"
            style={{ fontFamily: "Inter" }}
          >
            Active-Inactive Schools
          </h2>
          {hasSchoolData ? (
            <SchoolStatusChart
              activeSchools={dashboard.activeSchools}
              inActiveSchools={dashboard.inActiveSchools}
              suspendedSchools={dashboard.suspendedSchools}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg">
              <School size={32} className="text-gray-400 mb-1" />
              <p className="text-gray-600 font-medium text-sm">
                No school status data available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;