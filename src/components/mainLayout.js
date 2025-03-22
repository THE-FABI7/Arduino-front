import React from 'react';
import WaterManagementDashboard from './dashboard';
import SidebarMenu from './sidebar';

const MainLayout = () => {
  return (
    <div className="main-layout">   
      {/* <SidebarMenu /> */}
      <WaterManagementDashboard />
    </div>
  );
};

export default MainLayout;