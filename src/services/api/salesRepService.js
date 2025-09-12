export const getSalesReps = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

// Calculate real metrics from actual database data
    const calculateMetricsForRep = async (apperClient, repId, repName) => {
      try {
        // Count leads contacted by this rep
        const leadsParams = {
          fields: [{ field: { Name: "Name" } }],
          where: [{
            FieldName: "added_by_c",
            Operator: "EqualTo", 
            Values: [repId]
          }]
        };
        
        const leadsResponse = await apperClient.fetchRecords('lead_c', leadsParams);
        const leadsContacted = leadsResponse.success ? leadsResponse.data.length : 0;
        
        // Count meetings booked (Meeting Booked + Meeting Done stages)
        const meetingsParams = {
          fields: [{ field: { Name: "Name" } }],
          where: [{
            FieldName: "assigned_rep_c",
            Operator: "EqualTo",
            Values: [repId]
          }],
          whereGroups: [{
            operator: "AND",
            subGroups: [{
              conditions: [{
                fieldName: "stage_c",
                operator: "ExactMatch", 
                values: ["Meeting Booked", "Meeting Done"]
              }],
              operator: "OR"
            }]
          }]
        };
        
        const meetingsResponse = await apperClient.fetchRecords('deal_c', meetingsParams);
        const meetingsBooked = meetingsResponse.success ? meetingsResponse.data.length : 0;
        
        // Count closed deals and calculate revenue
        const closedDealsParams = {
          fields: [
            { field: { Name: "Name" } },
            { field: { Name: "value_c" } }
          ],
          where: [
            {
              FieldName: "assigned_rep_c",
              Operator: "EqualTo",
              Values: [repId]
            },
            {
              FieldName: "stage_c", 
              Operator: "EqualTo",
              Values: ["Closed"]
            }
          ]
        };
        
        const closedDealsResponse = await apperClient.fetchRecords('deal_c', closedDealsParams);
        const closedDeals = closedDealsResponse.success ? closedDealsResponse.data : [];
        const dealsClosed = closedDeals.length;
        const totalRevenue = closedDeals.reduce((sum, deal) => sum + (deal.value_c || 0), 0);
        
        // Calculate conversion rate
        const conversionRate = leadsContacted > 0 ? (dealsClosed / leadsContacted * 100) : 0;
        
        return {
          leadsContacted,
          meetingsBooked, 
          dealsClosed,
          totalRevenue,
          conversionRate
        };
      } catch (error) {
        console.error(`Error calculating metrics for rep ${repName}:`, error);
        return {
          leadsContacted: 0,
          meetingsBooked: 0,
          dealsClosed: 0, 
          totalRevenue: 0,
          conversionRate: 0
        };
      }
    };

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

    if (!response.data || response.data.length === 0) {
      return [];
    }

// Calculate real metrics for each sales rep
    const repsWithMetrics = await Promise.all(
      response.data.map(async (rep) => {
        const metrics = await calculateMetricsForRep(apperClient, rep.Id, rep.Name);
        return {
          Id: rep.Id,
          Name: rep.Name,
          leads_contacted_c: metrics.leadsContacted,
          meetings_booked_c: metrics.meetingsBooked,
          deals_closed_c: metrics.dealsClosed,
          total_revenue_c: metrics.totalRevenue,
          conversion_rate_c: metrics.conversionRate
        };
      })
    );

    return repsWithMetrics;
  } catch (error) {
    console.error("Error fetching sales reps:", error?.response?.data?.message || error.message);
    return [];
  }
};

export const getSalesRepById = async (id) => {
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

    const response = await apperClient.getRecordById('sales_rep_c', id, params);

    if (!response.success) {
      console.error(response.message);
      throw new Error("Sales rep not found");
    }

    const rep = response.data;
// Calculate metrics for single rep
    const calculateMetricsForRep = async (apperClient, repId, repName) => {
      try {
        // Count leads contacted by this rep
        const leadsParams = {
          fields: [{ field: { Name: "Name" } }],
          where: [{
            FieldName: "added_by_c",
            Operator: "EqualTo",
            Values: [repId]
          }]
        };
        
        const leadsResponse = await apperClient.fetchRecords('lead_c', leadsParams);
        const leadsContacted = leadsResponse.success ? leadsResponse.data.length : 0;
        
        // Count meetings booked (Meeting Booked + Meeting Done stages)
        const meetingsParams = {
          fields: [{ field: { Name: "Name" } }],
          where: [{
            FieldName: "assigned_rep_c",
            Operator: "EqualTo",
            Values: [repId]
          }],
          whereGroups: [{
            operator: "AND",
            subGroups: [{
              conditions: [{
                fieldName: "stage_c",
                operator: "ExactMatch",
                values: ["Meeting Booked", "Meeting Done"]
              }],
              operator: "OR"
            }]
          }]
        };
        
        const meetingsResponse = await apperClient.fetchRecords('deal_c', meetingsParams);
        const meetingsBooked = meetingsResponse.success ? meetingsResponse.data.length : 0;
        
        // Count closed deals and calculate revenue
        const closedDealsParams = {
          fields: [
            { field: { Name: "Name" } },
            { field: { Name: "value_c" } }
          ],
          where: [
            {
              FieldName: "assigned_rep_c",
              Operator: "EqualTo",
              Values: [repId]
            },
            {
              FieldName: "stage_c",
              Operator: "EqualTo", 
              Values: ["Closed"]
            }
          ]
        };
        
        const closedDealsResponse = await apperClient.fetchRecords('deal_c', closedDealsParams);
        const closedDeals = closedDealsResponse.success ? closedDealsResponse.data : [];
        const dealsClosed = closedDeals.length;
        const totalRevenue = closedDeals.reduce((sum, deal) => sum + (deal.value_c || 0), 0);
        
        // Calculate conversion rate
        const conversionRate = leadsContacted > 0 ? (dealsClosed / leadsContacted * 100) : 0;
        
        return {
          leadsContacted,
          meetingsBooked,
          dealsClosed,
          totalRevenue,
          conversionRate
        };
      } catch (error) {
        console.error(`Error calculating metrics for rep ${repName}:`, error);
        return {
          leadsContacted: 0,
          meetingsBooked: 0,
          dealsClosed: 0,
          totalRevenue: 0,
          conversionRate: 0
        };
      }
    };

    const metrics = await calculateMetricsForRep(apperClient, rep.Id, rep.Name);
    
    return {
      Id: rep.Id,
      Name: rep.Name,
      leads_contacted_c: metrics.leadsContacted,
      meetings_booked_c: metrics.meetingsBooked,
      deals_closed_c: metrics.dealsClosed,
      total_revenue_c: metrics.totalRevenue,
      conversion_rate_c: metrics.conversionRate
    };
  } catch (error) {
    console.error("Error fetching sales rep by ID:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const createSalesRep = async (repData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [
{
          Name: repData.name,
          leads_contacted_c: 0, // Will be calculated from actual data
          meetings_booked_c: 0, // Will be calculated from actual data  
          deals_closed_c: 0, // Will be calculated from actual data
          total_revenue_c: 0, // Will be calculated from actual data
          conversion_rate_c: 0 // Will be calculated from actual data
        }
      ]
    };

    const response = await apperClient.createRecord('sales_rep_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create sales rep records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create sales rep');
      }
      
      if (successfulRecords.length > 0) {
        const newRep = successfulRecords[0].data;
return {
          Id: newRep.Id,
          name: newRep.Name,
          leadsContacted: newRep.leads_contacted_c || 0,
          meetingsBooked: newRep.meetings_booked_c || 0,
          dealsClosed: newRep.deals_closed_c || 0,
          totalRevenue: newRep.total_revenue_c || 0,
          conversionRate: newRep.conversion_rate_c || 0
        };
      }
    }

    throw new Error('No records created');
  } catch (error) {
    console.error("Error creating sales rep:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const updateSalesRep = async (id, updates) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const updateData = {
      Id: id
    };

if (updates.name !== undefined) updateData.Name = updates.name;
// Note: Metrics are calculated from actual data, not directly updateable
    // Only allow name updates, metrics will be recalculated
    if (updates.name !== undefined) updateData.Name = updates.name;

    const params = {
      records: [updateData]
    };

    const response = await apperClient.updateRecord('sales_rep_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update sales rep records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update sales rep');
      }
      
      if (successfulRecords.length > 0) {
        const updatedRep = successfulRecords[0].data;
// Calculate fresh metrics for updated rep
        const calculateMetricsForRep = async (apperClient, repId, repName) => {
          try {
            // Count leads contacted by this rep
            const leadsParams = {
              fields: [{ field: { Name: "Name" } }],
              where: [{
                FieldName: "added_by_c",
                Operator: "EqualTo",
                Values: [repId]
              }]
            };
            
            const leadsResponse = await apperClient.fetchRecords('lead_c', leadsParams);
            const leadsContacted = leadsResponse.success ? leadsResponse.data.length : 0;
            
            // Count meetings booked (Meeting Booked + Meeting Done stages)
            const meetingsParams = {
              fields: [{ field: { Name: "Name" } }],
              where: [{
                FieldName: "assigned_rep_c",
                Operator: "EqualTo",
                Values: [repId]
              }],
              whereGroups: [{
                operator: "AND",
                subGroups: [{
                  conditions: [{
                    fieldName: "stage_c",
                    operator: "ExactMatch",
                    values: ["Meeting Booked", "Meeting Done"]
                  }],
                  operator: "OR"
                }]
              }]
            };
            
            const meetingsResponse = await apperClient.fetchRecords('deal_c', meetingsParams);
            const meetingsBooked = meetingsResponse.success ? meetingsResponse.data.length : 0;
            
            // Count closed deals and calculate revenue
            const closedDealsParams = {
              fields: [
                { field: { Name: "Name" } },
                { field: { Name: "value_c" } }
              ],
              where: [
                {
                  FieldName: "assigned_rep_c",
                  Operator: "EqualTo",
                  Values: [repId]
                },
                {
                  FieldName: "stage_c",
                  Operator: "EqualTo",
                  Values: ["Closed"]
                }
              ]
            };
            
            const closedDealsResponse = await apperClient.fetchRecords('deal_c', closedDealsParams);
            const closedDeals = closedDealsResponse.success ? closedDealsResponse.data : [];
            const dealsClosed = closedDeals.length;
            const totalRevenue = closedDeals.reduce((sum, deal) => sum + (deal.value_c || 0), 0);
            
            // Calculate conversion rate
            const conversionRate = leadsContacted > 0 ? (dealsClosed / leadsContacted * 100) : 0;
            
            return {
              leadsContacted,
              meetingsBooked,
              dealsClosed,
              totalRevenue,
              conversionRate
            };
          } catch (error) {
            console.error(`Error calculating metrics for rep ${repName}:`, error);
            return {
              leadsContacted: 0,
              meetingsBooked: 0,
              dealsClosed: 0,
              totalRevenue: 0,
              conversionRate: 0
            };
          }
        };

        const metrics = await calculateMetricsForRep(apperClient, updatedRep.Id, updatedRep.Name);

        return {
          Id: updatedRep.Id,
          Name: updatedRep.Name,
          leads_contacted_c: metrics.leadsContacted,
          meetings_booked_c: metrics.meetingsBooked,
          deals_closed_c: metrics.dealsClosed,
          total_revenue_c: metrics.totalRevenue,
          conversion_rate_c: metrics.conversionRate
        };
      }
    }

    throw new Error('No records updated');
  } catch (error) {
    console.error("Error updating sales rep:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteSalesRep = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [id]
    };

    const response = await apperClient.deleteRecord('sales_rep_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete sales rep records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to delete sales rep');
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting sales rep:", error?.response?.data?.message || error.message);
    throw error;
  }
};