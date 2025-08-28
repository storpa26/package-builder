// GoHighLevel API integration for lead submission
// This can be used directly from the frontend or adapted for your backend

interface LeadData {
  name: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  productContext?: {
    productType: string;
    context: string;
    selectedAddons?: string[];
    estimatedTotal?: number;
    productName?: string;
  };
  propertyContext?: {
    propertyType: string;
    buildingType: string;
    storeyType?: string;
    ceilingType?: string;
  };
}

interface GHLContact {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  address1: string;
  postalCode: string;
  source: string;
  tags?: string[];
  customFields?: Array<{ key: string; field_value: any }>;
  locationId: string;
}

interface GHLResponse {
  contact?: {
    id: string;
    email: string;
    phone: string;
  };
  error?: string;
  message?: string;
}

/**
 * Submit lead to GoHighLevel
 * Note: In production, this should be called from a backend API to keep tokens secure
 */
export async function submitLeadToGHL(leadData: LeadData): Promise<{ success: boolean; message: string; contactId?: string }> {
  try {
    // For development/demo - in production, these should come from your backend
    const GHL_TOKEN = 'pit-7299b9f4-9173-43d6-b5f9-2074b1c7dfb4';
    const GHL_LOCATION_ID = 'aLTXtdwNknfmEFo3WBIX';
    
    // Validate required fields
    if (!leadData.name || !leadData.email || !leadData.phone || !leadData.address || !leadData.postcode) {
      throw new Error('Missing required fields');
    }

    // Parse name into first and last name
    const nameParts = leadData.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Prepare contact data for GoHighLevel
    const contactData: GHLContact = {
      firstName,
      lastName,
      email: leadData.email,
      phone: leadData.phone,
      address1: leadData.address,
      postalCode: leadData.postcode,
      source: 'Website Lead Form',
      tags: ['Website Lead'],
      locationId: GHL_LOCATION_ID
    };

    // Add product and property context as custom fields and tags
    if (leadData.productContext || leadData.propertyContext) {
      contactData.customFields = [];
      
      // Product context
      if (leadData.productContext) {
        contactData.customFields.push(
          { key: 'product_name', field_value: leadData.productContext.productName || `${leadData.productContext.productType} ${leadData.productContext.context} System` },
          { key: 'product_type', field_value: leadData.productContext.productType },
          { key: 'product_context', field_value: leadData.productContext.context },
          { key: 'estimated_total', field_value: leadData.productContext.estimatedTotal || 0 },
          { key: 'selected_addons', field_value: leadData.productContext.selectedAddons?.join(', ') || '' }
        );
        
        // Add product-specific tags
        contactData.tags?.push(
          `Product: ${leadData.productContext.productType}`,
          `Context: ${leadData.productContext.context}`
        );
      }
      
      // Property context
      if (leadData.propertyContext) {
        contactData.customFields.push(
          { key: 'property_type', field_value: leadData.propertyContext.propertyType },
          { key: 'building_type', field_value: leadData.propertyContext.buildingType }
        );
        
        if (leadData.propertyContext.storeyType) {
          contactData.customFields.push(
            { key: 'storey_type', field_value: leadData.propertyContext.storeyType }
          );
        }
        if (leadData.propertyContext.ceilingType) {
          contactData.customFields.push(
            { key: 'ceiling_type', field_value: leadData.propertyContext.ceilingType }
          );
        }
        
        // Add property-specific tags
        contactData.tags?.push(
          `Property: ${leadData.propertyContext.propertyType}`,
          `Building: ${leadData.propertyContext.buildingType}`
        );
      }
    }

    console.log('Submitting contact to GoHighLevel...');
    console.log('Contact data being sent:', JSON.stringify(contactData, null, 2));

    // Submit to GoHighLevel Contacts API
    const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GHL_TOKEN}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify(contactData)
    });

    const result: GHLResponse = await response.json();

    if (!response.ok) {
      console.error('GoHighLevel API error:', result);
      throw new Error(result.error || result.message || `API returned ${response.status}`);
    }

    console.log('Successfully created contact in GoHighLevel:', result.contact?.id);

    // Optional: Add to pipeline if you have pipeline configuration
    // Uncomment and configure these if you want pipeline integration
    /*
    const PIPELINE_ID = 'your_pipeline_id';
    const STAGE_ID = 'your_stage_id';
    
    if (PIPELINE_ID && STAGE_ID && result.contact?.id) {
      try {
        await addToPipeline(result.contact.id, PIPELINE_ID, STAGE_ID, GHL_TOKEN, leadData);
      } catch (pipelineError) {
        console.error('Failed to add to pipeline (contact still created):', pipelineError);
      }
    }
    */

    return {
      success: true,
      message: 'Lead submitted successfully to GoHighLevel',
      contactId: result.contact?.id
    };

  } catch (error) {
    console.error('Error submitting lead to GoHighLevel:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to submit lead');
  }
}

/**
 * Add contact to a specific pipeline stage
 * Uncomment and use this if you want pipeline integration
 */
/*
async function addToPipeline(
  contactId: string,
  pipelineId: string,
  stageId: string,
  ghlToken: string,
  leadData: LeadData
) {
  const opportunityData = {
    pipelineId,
    stageId,
    contactId,
    name: `${leadData.productContext?.productType || 'Security'} System - ${leadData.name}`,
    monetaryValue: leadData.productContext?.estimatedTotal || 0,
    source: 'Website Lead Form'
  };

  const response = await fetch('https://services.leadconnectorhq.com/opportunities/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ghlToken}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28'
    },
    body: JSON.stringify(opportunityData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Pipeline API error: ${error.message || response.status}`);
  }

  const result = await response.json();
  console.log('Successfully added to pipeline:', result.opportunity?.id);
  return result;
}
*/

/**
 * Mock function for development/testing
 * Remove this in production
 */
export async function mockSubmitLead(leadData: LeadData): Promise<{ success: boolean; message: string; contactId?: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate random success/failure for testing
  if (Math.random() > 0.1) { // 90% success rate
    return {
      success: true,
      message: 'Lead submitted successfully (mock)',
      contactId: `mock_${Date.now()}`
    };
  } else {
    throw new Error('Mock API error for testing');
  }
}