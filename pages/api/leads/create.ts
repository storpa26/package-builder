import type { NextApiRequest, NextApiResponse } from 'next';

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
  customFields?: Record<string, any>;
}

interface GHLResponse {
  contact?: {
    id: string;
    email: string;
    phone: string;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const leadData: LeadData = req.body;

    // Validate required fields
    if (!leadData.name || !leadData.email || !leadData.phone || !leadData.address || !leadData.postcode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate environment variables
    const ghlToken = process.env.GHL_PRIVATE_TOKEN;
    const ghlLocationId = process.env.GHL_LOCATION_ID;
    
    if (!ghlToken || !ghlLocationId) {
      console.error('Missing GHL credentials in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
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
      tags: ['Website Lead']
    };

    // Add product context as custom fields and tags
    if (leadData.productContext) {
      contactData.customFields = {
        product_type: leadData.productContext.productType,
        product_context: leadData.productContext.context,
        estimated_total: leadData.productContext.estimatedTotal || 0,
        selected_addons: leadData.productContext.selectedAddons?.join(', ') || ''
      };
      
      // Add product-specific tags
      contactData.tags?.push(
        `Product: ${leadData.productContext.productType}`,
        `Context: ${leadData.productContext.context}`
      );
    }

    console.log('Submitting contact to GoHighLevel:', {
      ...contactData,
      phone: '***masked***' // Don't log sensitive data
    });

    // Submit to GoHighLevel Contacts API
    const ghlResponse = await fetch(`https://services.leadconnectorhq.com/contacts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ghlToken}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      },
      body: JSON.stringify({
        ...contactData,
        locationId: ghlLocationId
      })
    });

    const ghlResult: GHLResponse = await ghlResponse.json();

    if (!ghlResponse.ok) {
      console.error('GoHighLevel API error:', ghlResult);
      throw new Error(ghlResult.error || `GHL API returned ${ghlResponse.status}`);
    }

    console.log('Successfully created contact in GoHighLevel:', ghlResult.contact?.id);

    // Optional: Add to pipeline if configured
    const pipelineId = process.env.GHL_PIPELINE_ID;
    const stageId = process.env.GHL_STAGE_ID;
    
    if (pipelineId && stageId && ghlResult.contact?.id) {
      try {
        await addToPipeline(ghlResult.contact.id, pipelineId, stageId, ghlToken, leadData);
      } catch (pipelineError) {
        console.error('Failed to add to pipeline (contact still created):', pipelineError);
        // Don't fail the entire request if pipeline addition fails
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Lead submitted successfully',
      contactId: ghlResult.contact?.id
    });

  } catch (error) {
    console.error('Error submitting lead:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to submit lead'
    });
  }
}

// Helper function to add contact to pipeline
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

  const pipelineResponse = await fetch('https://services.leadconnectorhq.com/opportunities/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ghlToken}`,
      'Content-Type': 'application/json',
      'Version': '2021-07-28'
    },
    body: JSON.stringify(opportunityData)
  });

  if (!pipelineResponse.ok) {
    const error = await pipelineResponse.json();
    throw new Error(`Pipeline API error: ${error.message || pipelineResponse.status}`);
  }

  const result = await pipelineResponse.json();
  console.log('Successfully added to pipeline:', result.opportunity?.id);
  return result;
}