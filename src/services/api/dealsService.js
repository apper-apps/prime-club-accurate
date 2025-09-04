export const getDeals = async (year = null) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "lead_name_c" } },
        { field: { Name: "lead_id_c" } },
        { field: { Name: "value_c" } },
        { field: { Name: "stage_c" } },
        { field: { Name: "edition_c" } },
        { field: { Name: "start_month_c" } },
        { field: { Name: "end_month_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "assigned_rep_c" } }
      ]
    };

    // Add year filtering if specified
    if (year) {
      params.where = [
        {
          FieldName: "created_at_c",
          Operator: "ExactMatch",
          SubOperator: "Year",
          Values: [year.toString()]
        }
      ];
    }

    const response = await apperClient.fetchRecords('deal_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map(deal => ({
      Id: deal.Id,
      name: deal.Name,
      leadName: deal.lead_name_c || '',
      leadId: deal.lead_id_c || '',
      value: deal.value_c || 0,
      stage: deal.stage_c || 'Connected',
      edition: deal.edition_c || 'Select Edition',
      startMonth: deal.start_month_c || 1,
      endMonth: deal.end_month_c || 3,
      createdAt: deal.created_at_c || new Date().toISOString(),
      assignedRep: deal.assigned_rep_c?.Name || 'Unassigned',
      assignedRepId: deal.assigned_rep_c?.Id || null,
      year: year || new Date().getFullYear()
    }));
  } catch (error) {
    console.error("Error fetching deals:", error?.response?.data?.message || error.message);
    return [];
  }
};

export const getDealById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "lead_name_c" } },
        { field: { Name: "lead_id_c" } },
        { field: { Name: "value_c" } },
        { field: { Name: "stage_c" } },
        { field: { Name: "edition_c" } },
        { field: { Name: "start_month_c" } },
        { field: { Name: "end_month_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "assigned_rep_c" } }
      ]
    };

    const response = await apperClient.getRecordById('deal_c', id, params);

    if (!response.success) {
      console.error(response.message);
      throw new Error("Deal not found");
    }

    const deal = response.data;
    return {
      Id: deal.Id,
      name: deal.Name,
      leadName: deal.lead_name_c || '',
      leadId: deal.lead_id_c || '',
      value: deal.value_c || 0,
      stage: deal.stage_c || 'Connected',
      edition: deal.edition_c || 'Select Edition',
      startMonth: deal.start_month_c || 1,
      endMonth: deal.end_month_c || 3,
      createdAt: deal.created_at_c || new Date().toISOString(),
      assignedRep: deal.assigned_rep_c?.Name || 'Unassigned',
      assignedRepId: deal.assigned_rep_c?.Id || null
    };
  } catch (error) {
    console.error("Error fetching deal by ID:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const createDeal = async (dealData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [
        {
          Name: dealData.name,
          lead_name_c: dealData.leadName || '',
          lead_id_c: dealData.leadId || '',
          value_c: dealData.value || 0,
          stage_c: dealData.stage || 'Connected',
          edition_c: dealData.edition || 'Select Edition',
          start_month_c: dealData.startMonth || 1,
          end_month_c: dealData.endMonth || 3,
          created_at_c: new Date().toISOString(),
          assigned_rep_c: dealData.assignedRepId || null
        }
      ]
    };

    const response = await apperClient.createRecord('deal_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create deal records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create deal');
      }
      
      if (successfulRecords.length > 0) {
        const newDeal = successfulRecords[0].data;
        return {
          Id: newDeal.Id,
          name: newDeal.Name,
          leadName: newDeal.lead_name_c || '',
          leadId: newDeal.lead_id_c || '',
          value: newDeal.value_c || 0,
          stage: newDeal.stage_c || 'Connected',
          edition: newDeal.edition_c || 'Select Edition',
          startMonth: newDeal.start_month_c || 1,
          endMonth: newDeal.end_month_c || 3,
          createdAt: newDeal.created_at_c || new Date().toISOString(),
          assignedRep: newDeal.assigned_rep_c?.Name || 'Unassigned',
          assignedRepId: newDeal.assigned_rep_c?.Id || null
        };
      }
    }

    throw new Error('No records created');
  } catch (error) {
    console.error("Error creating deal:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const updateDeal = async (id, updates) => {
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
    if (updates.leadName !== undefined) updateData.lead_name_c = updates.leadName;
    if (updates.leadId !== undefined) updateData.lead_id_c = updates.leadId;
    if (updates.value !== undefined) updateData.value_c = updates.value;
    if (updates.stage !== undefined) updateData.stage_c = updates.stage;
    if (updates.edition !== undefined) updateData.edition_c = updates.edition;
    if (updates.startMonth !== undefined) updateData.start_month_c = updates.startMonth;
    if (updates.endMonth !== undefined) updateData.end_month_c = updates.endMonth;
    if (updates.assignedRepId !== undefined) updateData.assigned_rep_c = updates.assignedRepId;

    const params = {
      records: [updateData]
    };

    const response = await apperClient.updateRecord('deal_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update deal records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update deal');
      }
      
      if (successfulRecords.length > 0) {
        const updatedDeal = successfulRecords[0].data;
        return {
          Id: updatedDeal.Id,
          name: updatedDeal.Name,
          leadName: updatedDeal.lead_name_c || '',
          leadId: updatedDeal.lead_id_c || '',
          value: updatedDeal.value_c || 0,
          stage: updatedDeal.stage_c || 'Connected',
          edition: updatedDeal.edition_c || 'Select Edition',
          startMonth: updatedDeal.start_month_c || 1,
          endMonth: updatedDeal.end_month_c || 3,
          createdAt: updatedDeal.created_at_c || new Date().toISOString(),
          assignedRep: updatedDeal.assigned_rep_c?.Name || 'Unassigned',
          assignedRepId: updatedDeal.assigned_rep_c?.Id || null
        };
      }
    }

    throw new Error('No records updated');
  } catch (error) {
    console.error("Error updating deal:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteDeal = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [id]
    };

    const response = await apperClient.deleteRecord('deal_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete deal records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to delete deal');
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting deal:", error?.response?.data?.message || error.message);
    throw error;
  }
};