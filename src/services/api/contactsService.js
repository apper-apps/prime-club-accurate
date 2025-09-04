export const getContacts = async () => {
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
        { field: { Name: "company_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "assigned_rep_c" } },
        { field: { Name: "notes_c" } },
        { field: { Name: "created_at_c" } }
      ]
    };

    const response = await apperClient.fetchRecords('contact_c', params);

    if (!response.success) {
      console.error(response.message);
      return [];
    }

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map(contact => ({
      Id: contact.Id,
      name: contact.Name,
      email: contact.email_c || '',
      company: contact.company_c || '',
      status: contact.status_c || 'New',
      assignedRep: contact.assigned_rep_c?.Name || 'Unassigned',
      assignedRepId: contact.assigned_rep_c?.Id || null,
      notes: contact.notes_c || '',
      createdAt: contact.created_at_c || new Date().toISOString()
    }));
  } catch (error) {
    console.error("Error fetching contacts:", error?.response?.data?.message || error.message);
    return [];
  }
};

export const getContactById = async (id) => {
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
        { field: { Name: "company_c" } },
        { field: { Name: "status_c" } },
        { field: { Name: "assigned_rep_c" } },
        { field: { Name: "notes_c" } },
        { field: { Name: "created_at_c" } }
      ]
    };

    const response = await apperClient.getRecordById('contact_c', id, params);

    if (!response.success) {
      console.error(response.message);
      throw new Error("Contact not found");
    }

    const contact = response.data;
    return {
      Id: contact.Id,
      name: contact.Name,
      email: contact.email_c || '',
      company: contact.company_c || '',
      status: contact.status_c || 'New',
      assignedRep: contact.assigned_rep_c?.Name || 'Unassigned',
      assignedRepId: contact.assigned_rep_c?.Id || null,
      notes: contact.notes_c || '',
      createdAt: contact.created_at_c || new Date().toISOString()
    };
  } catch (error) {
    console.error("Error fetching contact by ID:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const createContact = async (contactData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      records: [
        {
          Name: contactData.name,
          email_c: contactData.email || '',
          company_c: contactData.company || '',
          status_c: contactData.status || 'New',
          assigned_rep_c: contactData.assignedRepId || null,
          notes_c: contactData.notes || '',
          created_at_c: new Date().toISOString()
        }
      ]
    };

    const response = await apperClient.createRecord('contact_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create contact records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to create contact');
      }
      
      if (successfulRecords.length > 0) {
        const newContact = successfulRecords[0].data;
        return {
          Id: newContact.Id,
          name: newContact.Name,
          email: newContact.email_c || '',
          company: newContact.company_c || '',
          status: newContact.status_c || 'New',
          assignedRep: newContact.assigned_rep_c?.Name || 'Unassigned',
          assignedRepId: newContact.assigned_rep_c?.Id || null,
          notes: newContact.notes_c || '',
          createdAt: newContact.created_at_c || new Date().toISOString()
        };
      }
    }

    throw new Error('No records created');
  } catch (error) {
    console.error("Error creating contact:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const updateContact = async (id, updates) => {
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
    if (updates.email !== undefined) updateData.email_c = updates.email;
    if (updates.company !== undefined) updateData.company_c = updates.company;
    if (updates.status !== undefined) updateData.status_c = updates.status;
    if (updates.assignedRepId !== undefined) updateData.assigned_rep_c = updates.assignedRepId;
    if (updates.notes !== undefined) updateData.notes_c = updates.notes;

    const params = {
      records: [updateData]
    };

    const response = await apperClient.updateRecord('contact_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update contact records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to update contact');
      }
      
      if (successfulRecords.length > 0) {
        const updatedContact = successfulRecords[0].data;
        return {
          Id: updatedContact.Id,
          name: updatedContact.Name,
          email: updatedContact.email_c || '',
          company: updatedContact.company_c || '',
          status: updatedContact.status_c || 'New',
          assignedRep: updatedContact.assigned_rep_c?.Name || 'Unassigned',
          assignedRepId: updatedContact.assigned_rep_c?.Id || null,
          notes: updatedContact.notes_c || '',
          createdAt: updatedContact.created_at_c || new Date().toISOString()
        };
      }
    }

    throw new Error('No records updated');
  } catch (error) {
    console.error("Error updating contact:", error?.response?.data?.message || error.message);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [id]
    };

    const response = await apperClient.deleteRecord('contact_c', params);

    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }

    if (response.results) {
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to delete contact records:${JSON.stringify(failedRecords)}`);
        throw new Error(failedRecords[0].message || 'Failed to delete contact');
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting contact:", error?.response?.data?.message || error.message);
    throw error;
  }
};