export const getSalesReps = async () => {
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

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map(rep => ({
      Id: rep.Id,
      name: rep.Name,
      leadsContacted: rep.leads_contacted_c || 0,
      meetingsBooked: rep.meetings_booked_c || 0,
      dealsClosed: rep.deals_closed_c || 0,
      totalRevenue: rep.total_revenue_c || 0
    }));
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
        { field: { Name: "Name" } },
        { field: { Name: "leads_contacted_c" } },
        { field: { Name: "meetings_booked_c" } },
        { field: { Name: "deals_closed_c" } },
        { field: { Name: "total_revenue_c" } }
      ]
    };

    const response = await apperClient.getRecordById('sales_rep_c', id, params);

    if (!response.success) {
      console.error(response.message);
      throw new Error("Sales rep not found");
    }

    const rep = response.data;
    return {
      Id: rep.Id,
      name: rep.Name,
      leadsContacted: rep.leads_contacted_c || 0,
      meetingsBooked: rep.meetings_booked_c || 0,
      dealsClosed: rep.deals_closed_c || 0,
      totalRevenue: rep.total_revenue_c || 0
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
          leads_contacted_c: repData.leadsContacted || 0,
          meetings_booked_c: repData.meetingsBooked || 0,
          deals_closed_c: repData.dealsClosed || 0,
          total_revenue_c: repData.totalRevenue || 0
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
          totalRevenue: newRep.total_revenue_c || 0
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
    if (updates.leadsContacted !== undefined) updateData.leads_contacted_c = updates.leadsContacted;
    if (updates.meetingsBooked !== undefined) updateData.meetings_booked_c = updates.meetingsBooked;
    if (updates.dealsClosed !== undefined) updateData.deals_closed_c = updates.dealsClosed;
    if (updates.totalRevenue !== undefined) updateData.total_revenue_c = updates.totalRevenue;

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
        return {
          Id: updatedRep.Id,
          name: updatedRep.Name,
          leadsContacted: updatedRep.leads_contacted_c || 0,
          meetingsBooked: updatedRep.meetings_booked_c || 0,
          dealsClosed: updatedRep.deals_closed_c || 0,
          totalRevenue: updatedRep.total_revenue_c || 0
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