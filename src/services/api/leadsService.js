export const getLeads = async (paginationParams = {}) => {
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
        { field: { Name: "team_size_c" } },
        { field: { Name: "arr_c" } },
        { field: { Name: "category_c" } },
        { field: { Name: "linkedin_url_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "funding_type_c" } },
        { field: { Name: "edition_c" } },
        { field: { Name: "follow_up_date_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "added_by_c" } }
      ],
      orderBy: [
        {
          fieldName: paginationParams.sort?.field 
            ? (paginationParams.sort.field === 'productName' ? 'product_name_c' : 
               paginationParams.sort.field === 'name' ? 'Name' :
               paginationParams.sort.field === 'websiteUrl' ? 'website_url_c' :
               paginationParams.sort.field === 'createdAt' ? 'created_at_c' :
               'created_at_c')
            : "created_at_c",
          sorttype: paginationParams.sort?.order?.toUpperCase() || "DESC"
        }
      ],
      pagingInfo: {
        limit: paginationParams.limit || 20,
        offset: ((paginationParams.page || 1) - 1) * (paginationParams.limit || 20)
      }
    };

    // Add search filters
    if (paginationParams.search) {
      params.whereGroups = [
        {
          operator: "OR",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "product_name_c",
                  operator: "Contains",
                  values: [paginationParams.search]
                }
              ],
              operator: "OR"
            },
            {
              conditions: [
                {
                  fieldName: "Name",
                  operator: "Contains",
                  values: [paginationParams.search]
                }
              ],
              operator: "OR"
            },
            {
              conditions: [
                {
                  fieldName: "website_url_c",
                  operator: "Contains",
                  values: [paginationParams.search]
                }
              ],
              operator: "OR"
            },
            {
              conditions: [
                {
                  fieldName: "category_c",
                  operator: "Contains",
                  values: [paginationParams.search]
                }
              ],
              operator: "OR"
            }
          ]
        }
      ];
    }

    // Add status filter
    if (paginationParams.filters?.status) {
      const statusWhere = {
        FieldName: "status_c",
        Operator: "EqualTo",
        Values: [paginationParams.filters.status]
      };
      
      if (params.where) {
        params.where.push(statusWhere);
      } else {
        params.where = [statusWhere];
      }
    }

    // Add funding filter
    if (paginationParams.filters?.funding) {
      const fundingWhere = {
        FieldName: "funding_type_c",
        Operator: "EqualTo",
        Values: [paginationParams.filters.funding]
      };
      
      if (params.where) {
        params.where.push(fundingWhere);
      } else {
        params.where = [fundingWhere];
      }
    }

    // Add category filter
    if (paginationParams.filters?.category) {
      const categoryWhere = {
        FieldName: "category_c",
        Operator: "EqualTo",
        Values: [paginationParams.filters.category]
      };
      
      if (params.where) {
        params.where.push(categoryWhere);
      } else {
        params.where = [categoryWhere];
      }
    }

    // Add team size filter
    if (paginationParams.filters?.teamSize) {
      const teamSizeWhere = {
        FieldName: "team_size_c",
        Operator: "EqualTo",
        Values: [paginationParams.filters.teamSize]
      };
      
      if (params.where) {
        params.where.push(teamSizeWhere);
      } else {
        params.where = [teamSizeWhere];
      }
    }

    const response = await apperClient.fetchRecords('lead_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (!response.data || response.data.length === 0) {
      return { leads: [], total: 0 };
    }

    const leads = response.data.map(lead => ({
      Id: lead.Id,
      Name: lead.Name,
      productName: lead.product_name_c || '',
      name: lead.Name || '',
      websiteUrl: lead.website_url_c || '',
      teamSize: lead.team_size_c || '1-3',
      arr: lead.arr_c || 0,
      category: lead.category_c || '',
      linkedinUrl: lead.linkedin_url_c || '',
      status: lead.status_c || 'Keep an Eye',
      fundingType: lead.funding_type_c || 'Bootstrapped',
      edition: lead.edition_c || 'Select Edition',
      followUpDate: lead.follow_up_date_c || null,
      createdAt: lead.created_at_c || new Date().toISOString(),
      addedBy: lead.added_by_c?.Id || null,
      addedByName: lead.added_by_c?.Name || 'Unknown'
    }));

    return { 
      leads, 
      total: response.total || leads.length 
    };
  } catch (error) {
    console.error("Error fetching leads:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const getLeadById = async (id) => {
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
        { field: { Name: "team_size_c" } },
        { field: { Name: "arr_c" } },
        { field: { Name: "category_c" } },
        { field: { Name: "linkedin_url_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "funding_type_c" } },
        { field: { Name: "edition_c" } },
        { field: { Name: "follow_up_date_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "added_by_c" } }
      ]
    };

    const response = await apperClient.getRecordById('lead_c', id, params);

    if (!response.success) {
      console.error(response.message);
      throw new Error("Lead not found");
    }

    const lead = response.data;
    return {
      Id: lead.Id,
      Name: lead.Name,
      productName: lead.product_name_c || '',
      name: lead.Name || '',
      websiteUrl: lead.website_url_c || '',
      teamSize: lead.team_size_c || '1-3',
      arr: lead.arr_c || 0,
      category: lead.category_c || '',
      linkedinUrl: lead.linkedin_url_c || '',
      status: lead.status_c || 'Keep an Eye',
      fundingType: lead.funding_type_c || 'Bootstrapped',
      edition: lead.edition_c || 'Select Edition',
      followUpDate: lead.follow_up_date_c || null,
      createdAt: lead.created_at_c || new Date().toISOString(),
      addedBy: lead.added_by_c?.Id || null,
      addedByName: lead.added_by_c?.Name || 'Unknown'
    };
  } catch (error) {
    console.error("Error fetching lead by ID:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const createLead = async (leadData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Validate required fields
    if (!leadData.websiteUrl || !leadData.websiteUrl.trim()) {
      throw new Error("Website URL is required");
    }

    const params = {
      records: [
        {
          Name: leadData.name || leadData.productName || '',
          product_name_c: leadData.productName || '',
          website_url_c: leadData.websiteUrl,
          team_size_c: leadData.teamSize || '1-3',
          arr_c: leadData.arr || 0,
          category_c: leadData.category || '',
          linkedin_url_c: leadData.linkedinUrl || '',
          status_c: leadData.status || 'Keep an Eye',
          funding_type_c: leadData.fundingType || 'Bootstrapped',
          edition_c: leadData.edition || 'Select Edition',
          follow_up_date_c: leadData.followUpDate || null,
          created_at_c: new Date().toISOString(),
          added_by_c: leadData.addedBy || null
        }
      ]
    };

    const response = await apperClient.createRecord('lead_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create lead records:${JSON.stringify(failedRecords)}`);
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            console.error(`${error.fieldLabel}: ${error}`);
          });
        });
        throw new Error(failedRecords[0].message || 'Failed to create lead');
      }
      
      if (successfulRecords.length > 0) {
        const newLead = successfulRecords[0].data;
        return {
          Id: newLead.Id,
          Name: newLead.Name,
          productName: newLead.product_name_c || '',
          name: newLead.Name || '',
          websiteUrl: newLead.website_url_c || '',
          teamSize: newLead.team_size_c || '1-3',
          arr: newLead.arr_c || 0,
          category: newLead.category_c || '',
          linkedinUrl: newLead.linkedin_url_c || '',
          status: newLead.status_c || 'Keep an Eye',
          fundingType: newLead.funding_type_c || 'Bootstrapped',
          edition: newLead.edition_c || 'Select Edition',
          followUpDate: newLead.follow_up_date_c || null,
          createdAt: newLead.created_at_c || new Date().toISOString(),
          addedBy: newLead.added_by_c?.Id || null,
          addedByName: newLead.added_by_c?.Name || 'Unknown'
        };
      }
    }

    throw new Error('No records created');
  } catch (error) {
    console.error("Error creating lead:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const updateLead = async (id, updates) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Map UI field names to database field names
    const updateData = {
      Id: id
    };

    if (updates.name !== undefined) updateData.Name = updates.name;
    if (updates.productName !== undefined) updateData.product_name_c = updates.productName;
    if (updates.websiteUrl !== undefined) updateData.website_url_c = updates.websiteUrl;
    if (updates.teamSize !== undefined) updateData.team_size_c = updates.teamSize;
    if (updates.arr !== undefined) updateData.arr_c = updates.arr;
    if (updates.category !== undefined) updateData.category_c = updates.category;
    if (updates.linkedinUrl !== undefined) updateData.linkedin_url_c = updates.linkedinUrl;
    if (updates.status !== undefined) updateData.status_c = updates.status;
    if (updates.fundingType !== undefined) updateData.funding_type_c = updates.fundingType;
    if (updates.edition !== undefined) updateData.edition_c = updates.edition;
    if (updates.followUpDate !== undefined) updateData.follow_up_date_c = updates.followUpDate;
    if (updates.addedBy !== undefined) updateData.added_by_c = updates.addedBy;

    const params = {
      records: [updateData]
    };

    const response = await apperClient.updateRecord('lead_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update lead records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update lead');
      }
      
      if (successfulRecords.length > 0) {
        const updatedLead = successfulRecords[0].data;
        return {
          Id: updatedLead.Id,
          Name: updatedLead.Name,
          productName: updatedLead.product_name_c || '',
          name: updatedLead.Name || '',
          websiteUrl: updatedLead.website_url_c || '',
          teamSize: updatedLead.team_size_c || '1-3',
          arr: updatedLead.arr_c || 0,
          category: updatedLead.category_c || '',
          linkedinUrl: updatedLead.linkedin_url_c || '',
          status: updatedLead.status_c || 'Keep an Eye',
          fundingType: updatedLead.funding_type_c || 'Bootstrapped',
          edition: updatedLead.edition_c || 'Select Edition',
          followUpDate: updatedLead.follow_up_date_c || null,
          createdAt: updatedLead.created_at_c || new Date().toISOString(),
          addedBy: updatedLead.added_by_c?.Id || null,
          addedByName: updatedLead.added_by_c?.Name || 'Unknown'
        };
      }
    }

    throw new Error('No records updated');
  } catch (error) {
    console.error("Error updating lead:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteLead = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [id]
    };

    const response = await apperClient.deleteRecord('lead_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete lead records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to delete lead');
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting lead:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const getDailyLeadsReport = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Get today's leads
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "product_name_c" } },
        { field: { Name: "website_url_c" } },
        { field: { Name: "category_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "added_by_c" } }
      ],
      where: [
        {
          FieldName: "created_at_c",
          Operator: "RelativeMatch",
          Values: ["Today"]
        }
      ]
    };

    const response = await apperClient.fetchRecords('lead_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    // Get all sales reps
    const salesRepsParams = {
      fields: [
        { field: { Name: "Name" } }
      ]
    };

    const salesRepsResponse = await apperClient.fetchRecords('sales_rep_c', salesRepsParams);
    const salesReps = salesRepsResponse.success ? salesRepsResponse.data : [];

    // Group leads by sales rep
    const reportData = {};

    // Initialize all sales reps
    salesReps.forEach(rep => {
      reportData[rep.Name] = {
        salesRep: rep.Name,
        salesRepId: rep.Id,
        leads: [],
        leadCount: 0,
        lowPerformance: false
      };
    });

    // Add today's leads to respective sales reps
    if (response.data) {
      response.data.forEach(lead => {
        const repName = lead.added_by_c?.Name || 'Unknown';
        if (reportData[repName]) {
          reportData[repName].leads.push({
            Id: lead.Id,
            Name: lead.Name,
            productName: lead.product_name_c || '',
            websiteUrl: lead.website_url_c || '',
            category: lead.category_c || '',
            status: lead.status_c || '',
            createdAt: lead.created_at_c || new Date().toISOString()
          });
        }
      });
    }

    // Calculate counts and performance
    Object.values(reportData).forEach(repData => {
      repData.leadCount = repData.leads.length;
      repData.lowPerformance = repData.leadCount < 5;
    });

    return Object.values(reportData).sort((a, b) => b.leadCount - a.leadCount);
  } catch (error) {
    console.error("Error fetching daily leads report:", error?.response?.data?.message || error.message);
    return [];
  }
};

export const getPendingFollowUps = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "website_url_c" } },
        { field: { Name: "category_c" } },
        { field: { Name: "follow_up_date_c" } },
        { field: { Name: "status_c" } }
      ],
      where: [
        {
          FieldName: "follow_up_date_c",
          Operator: "RelativeMatch",
          Values: ["next 7 days"]
        }
      ],
      orderBy: [
        {
          fieldName: "follow_up_date_c",
          sorttype: "ASC"
        }
      ]
    };

    const response = await apperClient.fetchRecords('lead_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map(lead => ({
      Id: lead.Id,
      Name: lead.Name,
      websiteUrl: lead.website_url_c || '',
      category: lead.category_c || '',
      followUpDate: lead.follow_up_date_c,
      status: lead.status_c || ''
    }));
  } catch (error) {
    console.error("Error fetching pending follow-ups:", error?.response?.data?.message || error.message);
    return [];
  }
};

export const getFreshLeadsOnly = async (leadsArray) => {
  // For now, return all leads as "fresh" since we can't easily track history in database
  // This function can be enhanced later with proper tracking
  return leadsArray || [];
};