import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chart from 'react-google-charts';
import { summaryOrder } from '../actions/orderActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function DashboardScreen() {
  const orderSummary = useSelector((state) => state.orderSummary);
  const { loading, summary, error } = orderSummary;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(summaryOrder());
  }, [dispatch]);

  return (
    <div className="admin-dashboard">
      {/* PAGE HEADER */}
      <div className="dashboard-header">
        <div>
          <div className="dashboard-eyebrow">ADMIN PANEL</div>
          <h1>Dashboard</h1>
          <p>Overview of your store performance and activity.</p>
        </div>

        <div className="dashboard-badge">
          <i className="fa fa-bar-chart"></i>
          Store Overview
        </div>
      </div>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {/* SUMMARY CARDS */}
          <div className="dashboard-summary">
            {/* USERS */}
            <div className="dashboard-card">
              <div className="dashboard-card-top">
                <div>
                  <p className="dashboard-card-label">TOTAL USERS</p>
                  <h2>
                    {summary.users && summary.users[0]
                      ? summary.users[0].numUsers
                      : 0}
                  </h2>
                </div>

                <div className="dashboard-icon users-icon">
                  <i className="fa fa-users"></i>
                </div>
              </div>

              <div className="dashboard-card-footer">
                <span>Registered customers</span>
              </div>
            </div>

            {/* ORDERS */}
            <div className="dashboard-card">
              <div className="dashboard-card-top">
                <div>
                  <p className="dashboard-card-label">TOTAL ORDERS</p>
                  <h2>
                    {summary.orders && summary.orders[0]
                      ? summary.orders[0].numOrders
                      : 0}
                  </h2>
                </div>

                <div className="dashboard-icon orders-icon">
                  <i className="fa fa-shopping-cart"></i>
                </div>
              </div>

              <div className="dashboard-card-footer">
                <span>Total orders placed</span>
              </div>
            </div>

            {/* SALES */}
            <div className="dashboard-card">
              <div className="dashboard-card-top">
                <div>
                  <p className="dashboard-card-label">TOTAL SALES</p>
                  <h2>
                    $
                    {summary.orders && summary.orders[0]
                      ? summary.orders[0].totalSales.toFixed(2)
                      : '0.00'}
                  </h2>
                </div>

                <div className="dashboard-icon sales-icon">
                  <i className="fa fa-money"></i>
                </div>
              </div>

              <div className="dashboard-card-footer">
                <span>Total revenue generated</span>
              </div>
            </div>
          </div>

          {/* SALES CHART */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <div className="dashboard-section-eyebrow">
                  PERFORMANCE
                </div>
                <h2>Sales Overview</h2>
                <p>Daily sales performance of your store.</p>
              </div>

              <div className="section-icon">
                <i className="fa fa-line-chart"></i>
              </div>
            </div>

            <div className="chart-container">
              {summary.dailyOrders &&
              summary.dailyOrders.length === 0 ? (
                <MessageBox>No Sale</MessageBox>
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="AreaChart"
                  loader={<div>Loading Chart...</div>}
                  data={[
                    ['Date', 'Sales'],
                    ...(summary.dailyOrders || []).map((x) => [
                      x._id,
                      x.sales,
                    ]),
                  ]}
                  options={{
                    legend: { position: 'none' },
                    chartArea: {
                      left: 60,
                      top: 30,
                      right: 30,
                      bottom: 60,
                      width: '90%',
                      height: '80%',
                    },
                    hAxis: {
                      title: 'Date',
                    },
                    vAxis: {
                      title: 'Sales ($)',
                      minValue: 0,
                    },
                    areaOpacity: 0.15,
                    lineWidth: 3,
                  }}
                />
              )}
            </div>
          </div>

          {/* CATEGORY CHART */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <div>
                <div className="dashboard-section-eyebrow">
                  INVENTORY
                </div>
                <h2>Product Categories</h2>
                <p>Distribution of products across categories.</p>
              </div>

              <div className="section-icon">
                <i className="fa fa-pie-chart"></i>
              </div>
            </div>

            <div className="chart-container category-chart">
              {summary.productCategories &&
              summary.productCategories.length === 0 ? (
                <MessageBox>No Category</MessageBox>
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="PieChart"
                  loader={<div>Loading Chart...</div>}
                  data={[
                    ['Category', 'Products'],
                    ...(summary.productCategories || []).map((x) => [
                      x._id,
                      x.count,
                    ]),
                  ]}
                  options={{
                    pieHole: 0.35,
                    legend: {
                      position: 'right',
                    },
                    chartArea: {
                      left: 20,
                      top: 20,
                      right: 20,
                      bottom: 20,
                      width: '90%',
                      height: '90%',
                    },
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}