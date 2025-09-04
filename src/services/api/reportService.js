// Utility function to clean website URLs by removing trailing slash
const cleanWebsiteUrl = (url) => {
  if (!url) return url;
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

// Helper functions
const getStatusSummary = (data) => {
  const summary = {};
  data.forEach(lead => {
    summary[lead.status_c] = (summary[lead.status_c] || 0) + 1;
  });
  return summary;
};

const getCategorySummary = (data) => {
  const summary = {};
  data.forEach(lead => {
    summary[lead.category_c] = (summary[lead.category_c] || 0) + 1;
  });
  return summary;
};

export const getWebsiteUrlActivity = async (filters = {}) => {
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
        { field: { Name: "arr_c" } },
        { field: { Name: "funding_type_c" } },
        { field: { Name: "team_size_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "added_by_c" } }
      ],
      where: []
    };

    // Add date filtering
    if (filters.startDate && filters.endDate) {
      params.where.push({
        FieldName: "created_at_c",
        Operator: "GreaterThanOrEqualTo",
        Values: [filters.startDate]
      });
      params.where.push({
        FieldName: "created_at_c",
        Operator: "LessThanOrEqualTo", 
        Values: [filters.endDate]
      });
    } else if (filters.date) {
      params.where.push({
        FieldName: "created_at_c",
        Operator: "ExactMatch",
        SubOperator: "Day",
        Values: [new Date(filters.date).toLocaleDateString('en-GB', { 
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })]
      });
    }

    // Add user filtering
    if (filters.addedBy) {
      params.where.push({
        FieldName: "added_by_c",
        Operator: "EqualTo",
        Values: [filters.addedBy]
      });
    }

    // Add search filtering
    if (filters.searchTerm) {
      params.whereGroups = [
        {
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "website_url_c",
                  operator: "Contains",
                  values: [filters.searchTerm]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "category_c", 
                  operator: "Contains",
                  values: [filters.searchTerm]
                }
              ]
            }
          ]
        }
      ];
    }

    const response = await apperClient.fetchRecords('lead_c', params);

    if (!response.success) {
      console.error(response.message);
      return {
        data: [],
        summary: { totalUrls: 0, totalArr: 0, byStatus: {}, byCategory: {} }
      };
    }

    const data = response.data || [];
    const cleanedData = data.map(lead => ({
      Id: lead.Id,
      Name: lead.Name,
      productName: lead.product_name_c || '',
      websiteUrl: cleanWebsiteUrl(lead.website_url_c || ''),
      category: lead.category_c || '',
      status: lead.status_c || '',
      arr: lead.arr_c || 0,
      fundingType: lead.funding_type_c || '',
      teamSize: lead.team_size_c || '',
      createdAt: lead.created_at_c || new Date().toISOString(),
      addedBy: lead.added_by_c?.Id || null,
      addedByName: lead.added_by_c?.Name || 'Unknown'
    }));

    return {
      data: cleanedData,
      summary: {
        totalUrls: data.length,
        totalArr: data.reduce((sum, lead) => sum + (lead.arr_c || 0), 0),
        byStatus: getStatusSummary(data),
        byCategory: getCategorySummary(data)
      }
    };
  } catch (error) {
    console.error("Error fetching website URL activity:", error?.response?.data?.message || error.message);
    return {
      data: [],
      summary: { totalUrls: 0, totalArr: 0, byStatus: {}, byCategory: {} }
    };
  }
};

export const getActivityByDate = async (date) => {
  return await getWebsiteUrlActivity({ date });
};

export const getActivityByUser = async (userId) => {
  return await getWebsiteUrlActivity({ addedBy: userId });
};

export const getQuickDateFilters = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setDate(thisWeekStart.getDate() - 1);
  
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return {
    today: today.toISOString().split('T')[0],
    yesterday: yesterday.toISOString().split('T')[0],
    thisWeekStart: thisWeekStart.toISOString().split('T')[0],
    thisWeekEnd: today.toISOString().split('T')[0],
    lastWeekStart: lastWeekStart.toISOString().split('T')[0],
    lastWeekEnd: lastWeekEnd.toISOString().split('T')[0],
    thisMonthStart: thisMonthStart.toISOString().split('T')[0],
    thisMonthEnd: today.toISOString().split('T')[0]
  };
};

export const getSalesRepsForFilter = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } }
      ]
    };

    const response = await apperClient.fetchRecords('sales_rep_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching sales reps for filter:", error?.response?.data?.message || error.message);
    return [];
  }
};

export const getDailyWebsiteUrls = async (salesRepId, date) => {
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
        { field: { Name: "arr_c" } },
        { field: { Name: "created_at_c" } }
      ],
      where: []
    };

    // Filter by sales rep
    if (salesRepId) {
      params.where.push({
        FieldName: "added_by_c",
        Operator: "EqualTo",
        Values: [salesRepId]
      });
    }

    // Filter by date
    if (date) {
      params.where.push({
        FieldName: "created_at_c",
        Operator: "ExactMatch",
        SubOperator: "Day",
        Values: [new Date(date).toLocaleDateString('en-GB', { 
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })]
      });
    }

    const response = await apperClient.fetchRecords('lead_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    const data = response.data || [];
    return data.map(lead => ({
      Id: lead.Id,
      Name: lead.Name,
      productName: lead.product_name_c || '',
      websiteUrl: cleanWebsiteUrl(lead.website_url_c || ''),
      category: lead.category_c || '',
      status: lead.status_c || '',
      arr: lead.arr_c || 0,
      createdAt: lead.created_at_c || new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error fetching daily website URLs:", error?.response?.data?.message || error.message);
    return [];
  }
};

// Re-export sales reps for easy access
export { getSalesReps } from './salesRepService';

export const exportWebsiteUrlData = async (filters = {}) => {
  const result = await getWebsiteUrlActivity(filters);
  
  return result.data.map(lead => ({
    'Website URL': cleanWebsiteUrl(lead.websiteUrl),
    'Category': lead.category,
    'Team Size': lead.teamSize,
    'ARR': `$${(lead.arr / 1000000).toFixed(1)}M`,
    'Status': lead.status,
    'Funding Type': lead.fundingType,
    'Added By': lead.addedByName,
    'Date Added': new Date(lead.createdAt).toLocaleDateString()
  }));
};