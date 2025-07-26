import React, { useContext, useState } from 'react'
import { AppContext } from '../../context/AppContext'

const Dashboard = () => {
  const {currency} = useContext(AppContext);
  const [dashboardData,setDashboardData] = useState(null)
  return (
    <div>
        <h1>Dashboard</h1>
    </div>
  )
}

export default Dashboard