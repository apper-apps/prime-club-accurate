export const getTeamMembers = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "email_c" } },
        { field: { Name: "role_c" } },
        { field: { Name: "permissions_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "updated_at_c" } },
        { field: { Name: "last_login_c" } }
      ]
    };

    const response = await apperClient.fetchRecords('team_member_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map(member => {
      let permissions = {};
      try {
        permissions = typeof member.permissions_c === 'string' 
          ? JSON.parse(member.permissions_c) 
          : member.permissions_c || {};
      } catch {
        permissions = {};
      }

      return {
        Id: member.Id,
        name: member.Name,
        email: member.email_c || '',
        role: member.role_c || 'viewer',
        permissions: permissions,
        status: member.status_c || 'pending',
        createdAt: member.created_at_c || new Date().toISOString(),
        updatedAt: member.updated_at_c || new Date().toISOString(),
        lastLogin: member.last_login_c || null
      };
    });
  } catch (error) {
    console.error("Error fetching team members:", error?.response?.data?.message || error.message);
    return [];
  }
};

export const getTeamMemberById = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "email_c" } },
        { field: { Name: "role_c" } },
        { field: { Name: "permissions_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "created_at_c" } },
        { field: { Name: "updated_at_c" } },
        { field: { Name: "last_login_c" } }
      ]
    };

    const response = await apperClient.getRecordById('team_member_c', id, params);

    if (!response.success) {
      console.error(response.message);
      throw new Error("Team member not found");
    }

    const member = response.data;
    let permissions = {};
    try {
      permissions = typeof member.permissions_c === 'string' 
        ? JSON.parse(member.permissions_c) 
        : member.permissions_c || {};
    } catch {
      permissions = {};
    }

    return {
      Id: member.Id,
      name: member.Name,
      email: member.email_c || '',
      role: member.role_c || 'viewer',
      permissions: permissions,
      status: member.status_c || 'pending',
      createdAt: member.created_at_c || new Date().toISOString(),
      updatedAt: member.updated_at_c || new Date().toISOString(),
      lastLogin: member.last_login_c || null
    };
  } catch (error) {
    console.error("Error fetching team member by ID:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const inviteTeamMember = async (memberData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Validate required fields
    if (!memberData.name || !memberData.name.trim()) {
      throw new Error("Member name is required");
    }

    if (!memberData.email || !memberData.email.trim()) {
      throw new Error("Member email is required");
    }

    const params = {
      records: [
        {
          Name: memberData.name.trim(),
          email_c: memberData.email.trim().toLowerCase(),
          role_c: memberData.role || 'viewer',
          permissions_c: JSON.stringify(memberData.permissions || {
            dashboard: true,
            leads: false,
            hotlist: false,
            pipeline: false,
            calendar: false,
            analytics: false,
            leaderboard: false,
            contacts: false
          }),
          status_c: 'pending',
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString(),
          last_login_c: null
        }
      ]
    };

    const response = await apperClient.createRecord('team_member_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create team member records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create team member');
      }
      
      if (successfulRecords.length > 0) {
        const newMember = successfulRecords[0].data;
        let permissions = {};
        try {
          permissions = typeof newMember.permissions_c === 'string' 
            ? JSON.parse(newMember.permissions_c) 
            : newMember.permissions_c || {};
        } catch {
          permissions = {};
        }

        return {
          Id: newMember.Id,
          name: newMember.Name,
          email: newMember.email_c || '',
          role: newMember.role_c || 'viewer',
          permissions: permissions,
          status: newMember.status_c || 'pending',
          createdAt: newMember.created_at_c || new Date().toISOString(),
          updatedAt: newMember.updated_at_c || new Date().toISOString(),
          lastLogin: newMember.last_login_c || null
        };
      }
    }

    throw new Error('No records created');
  } catch (error) {
    console.error("Error creating team member:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const updateTeamMember = async (id, updates) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const updateData = {
      Id: id,
      updated_at_c: new Date().toISOString()
    };

    if (updates.name !== undefined) updateData.Name = updates.name;
    if (updates.email !== undefined) updateData.email_c = updates.email;
    if (updates.role !== undefined) updateData.role_c = updates.role;
    if (updates.permissions !== undefined) updateData.permissions_c = JSON.stringify(updates.permissions);
    if (updates.status !== undefined) updateData.status_c = updates.status;
    if (updates.lastLogin !== undefined) updateData.last_login_c = updates.lastLogin;

    const params = {
      records: [updateData]
    };

    const response = await apperClient.updateRecord('team_member_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update team member records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update team member');
      }
      
      if (successfulRecords.length > 0) {
        const updatedMember = successfulRecords[0].data;
        let permissions = {};
        try {
          permissions = typeof updatedMember.permissions_c === 'string' 
            ? JSON.parse(updatedMember.permissions_c) 
            : updatedMember.permissions_c || {};
        } catch {
          permissions = {};
        }

        return {
          Id: updatedMember.Id,
          name: updatedMember.Name,
          email: updatedMember.email_c || '',
          role: updatedMember.role_c || 'viewer',
          permissions: permissions,
          status: updatedMember.status_c || 'pending',
          createdAt: updatedMember.created_at_c || new Date().toISOString(),
          updatedAt: updatedMember.updated_at_c || new Date().toISOString(),
          lastLogin: updatedMember.last_login_c || null
        };
      }
    }

    throw new Error('No records updated');
  } catch (error) {
    console.error("Error updating team member:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const removeTeamMember = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [id]
    };

    const response = await apperClient.deleteRecord('team_member_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete team member records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to delete team member');
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting team member:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const getTeamMemberPerformance = async (id) => {
  // Mock performance data since this would require complex queries across multiple tables
  const mockPerformance = {
    totalLeads: Math.floor(Math.random() * 50) + 20,
    totalDeals: Math.floor(Math.random() * 10) + 5,
    totalRevenue: Math.floor(Math.random() * 50000) + 10000,
    totalMeetings: Math.floor(Math.random() * 20) + 10,
    conversionRate: Math.floor(Math.random() * 15) + 5,
    avgDealSize: 0
  };
  
  mockPerformance.avgDealSize = mockPerformance.totalDeals > 0 ? 
    Math.round(mockPerformance.totalRevenue / mockPerformance.totalDeals) : 0;
  
  return mockPerformance;
};

export const activateTeamMember = async (id) => {
  return updateTeamMember(id, { status: 'active' });
};

export const deactivateTeamMember = async (id) => {
  return updateTeamMember(id, { status: 'inactive' });
};