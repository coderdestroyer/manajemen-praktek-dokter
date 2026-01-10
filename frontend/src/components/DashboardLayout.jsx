import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet /> 
      </div>
    </div>
  );
}