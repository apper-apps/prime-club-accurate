// Helper function to get date ranges
const getDateRange = (period) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (period) {
    case 'today':
      return {
        start: today,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      };
    case 'yesterday':
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      return {
        start: yesterday,
        end: today
      };
    case 'week':
      const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return {
        start: weekStart,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      };
    case 'month':
      const monthStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return {
        start: monthStart,
        end: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      };
    default:
      return {
        start: new Date(0),
        end: new Date()
      };
  }
};

export const getLeadsAnalytics = async (period = 'all', userId = 'all') => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "product_name_c" } },
        { field: { Name: "website_url_c" } },
        { field: { Name: "category_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "added_by_c" } }
      ]
    };

    // Add date filtering if needed
    if (period !== 'all') {
      const { start, end } = getDateRange(period);
      params.where = [
        {
          FieldName: "created_at_c",
          Operator: "RelativeMatch",
          Values: [period]
        }
      ];
    }

    // Add user filtering if needed
    if (userId !== 'all') {
      if (!params.where) params.where = [];
      params.where.push({
        FieldName: "added_by_c",
        Operator: "EqualTo",
        Values: [parseInt(userId)]
      });
    }

    const response = await apperClient.fetchRecords('lead_c', params);

    if (!response.success) {
      console.error(response.message);
      return { leads: [], totalCount: 0 };
    }

    const leads = response.data.map(lead => ({
      ...lead,
      addedByName: lead.added_by_c?.Name || 'Unknown'
    }));

    return {
      leads,
      totalCount: leads.length
    };
  } catch (error) {
    console.error("Error fetching leads analytics:", error?.response?.data?.message || error.message);
    return { leads: [], totalCount: 0 };
  }
};

export const getDailyLeadsChart = async (userId = 'all', days = 30) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "created_at_c" } },
        { field: { Name: "added_by_c" } }
      ],
      where: []
    };

    // Add user filtering if needed
    if (userId !== 'all') {
      params.where.push({
        FieldName: "added_by_c",
        Operator: "EqualTo",
        Values: [parseInt(userId)]
      });
    }

    // Add date range filtering for last X days
    params.where.push({
      FieldName: "created_at_c",
      Operator: "RelativeMatch",
      Values: [`last ${days} days`]
    });

    const response = await apperClient.fetchRecords('lead_c', params);

    if (!response.success) {
      console.error(response.message);
      return {
        chartData: [],
        categories: [],
        series: [{ name: 'New Leads', data: [] }]
      };
    }

    const now = new Date();
    const chartData = [];

    // Generate data for the last X days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLeads = response.data.filter(lead => {
        const leadDate = new Date(lead.created_at_c).toISOString().split('T')[0];
        return leadDate === dateStr;
      });
      
      chartData.push({
        date: dateStr,
        count: dayLeads.length,
        formattedDate: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }

    return {
      chartData,
      categories: chartData.map(item => item.formattedDate),
      series: [
        {
          name: 'New Leads',
          data: chartData.map(item => item.count)
        }
      ]
    };
  } catch (error) {
    console.error("Error fetching daily leads chart:", error?.response?.data?.message || error.message);
    return {
      chartData: [],
      categories: [],
      series: [{ name: 'New Leads', data: [] }]
    };
  }
};

export const getLeadsMetrics = async (userId = 'all') => {
  try {
    const todayData = await getLeadsAnalytics('today', userId);
    const yesterdayData = await getLeadsAnalytics('yesterday', userId);
    const weekData = await getLeadsAnalytics('week', userId);
    const monthData = await getLeadsAnalytics('month', userId);
    const allData = await getLeadsAnalytics('all', userId);

    const todayCount = todayData.totalCount;
    const yesterdayCount = yesterdayData.totalCount;
    const weekCount = weekData.totalCount;
    const monthCount = monthData.totalCount;

    // Calculate percentage changes
    const todayTrend = yesterdayCount === 0 ? 100 : 
      Math.round(((todayCount - yesterdayCount) / yesterdayCount) * 100);

    // Get status distribution
    const statusCounts = allData.leads.reduce((acc, lead) => {
      acc[lead.status_c] = (acc[lead.status_c] || 0) + 1;
      return acc;
    }, {});

    // Get category distribution
    const categoryCounts = allData.leads.reduce((acc, lead) => {
      acc[lead.category_c] = (acc[lead.category_c] || 0) + 1;
      return acc;
    }, {});

    return {
      metrics: {
        today: {
          count: todayCount,
          trend: todayTrend,
          label: 'Today'
        },
        yesterday: {
          count: yesterdayCount,
          label: 'Yesterday'
        },
        week: {
          count: weekCount,
          label: 'This Week'
        },
        month: {
          count: monthCount,
          label: 'This Month'
        }
      },
      statusDistribution: statusCounts,
      categoryDistribution: categoryCounts,
      totalLeads: allData.totalCount
    };
  } catch (error) {
    console.error("Error fetching leads metrics:", error?.response?.data?.message || error.message);
    return {
      metrics: {
        today: { count: 0, trend: 0, label: 'Today' },
        yesterday: { count: 0, label: 'Yesterday' },
        week: { count: 0, label: 'This Week' },
        month: { count: 0, label: 'This Month' }
      },
      statusDistribution: {},
      categoryDistribution: {},
      totalLeads: 0
    };
  }
};

export const getUserPerformance = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "leads_contacted_c" } },
        { field: { Name: "meetings_booked_c" } },
        { field: { Name: "deals_closed_c" } },
        { field: { Name: "total_revenue_c" } }
      ]
    };

    const response = await apperClient.fetchRecords('sales_rep_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    // Get leads data for each sales rep
    const leadsParams = {
      fields: [
        { field: { Name: "added_by_c" } },
        { field: { Name: "created_at_c" } }
      ]
    };

    const leadsResponse = await apperClient.fetchRecords('lead_c', leadsParams);
    const allLeads = leadsResponse.success ? leadsResponse.data : [];

    const userStats = response.data.map(rep => {
      const userLeads = allLeads.filter(lead => lead.added_by_c?.Id === rep.Id);
      
      const today = new Date().toISOString().split('T')[0];
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 7);
      const monthStart = new Date();
      monthStart.setDate(monthStart.getDate() - 30);

      const todayLeads = userLeads.filter(lead => 
        new Date(lead.created_at_c).toISOString().split('T')[0] === today
      );
      const weekLeads = userLeads.filter(lead => 
        new Date(lead.created_at_c) >= weekStart
      );
      const monthLeads = userLeads.filter(lead => 
        new Date(lead.created_at_c) >= monthStart
      );

      return {
        ...rep,
        totalLeads: userLeads.length,
        todayLeads: todayLeads.length,
        weekLeads: weekLeads.length,
        monthLeads: monthLeads.length,
        conversionRate: rep.meetings_booked_c > 0 ? 
          Math.round((rep.deals_closed_c / rep.meetings_booked_c) * 100) : 0
      };
    });

    return userStats.sort((a, b) => b.totalLeads - a.totalLeads);
  } catch (error) {
    console.error("Error fetching user performance:", error?.response?.data?.message || error.message);
    return [];
  }
};