# GoHighLevel Lead Capture Integration Guide

## Overview

This implementation provides a complete lead capture form that integrates with GoHighLevel (GHL) CRM. The form captures Australian customer details and automatically creates contacts in your GHL account with product context.

## ✅ What's Been Implemented

### Enhanced Lead Capture Form
- **Fields**: Name, Email, Phone (AU validation), Address, Postcode (AU validation)
- **Product Context**: Automatically captures what product/system the user was viewing
- **Validation**: Australian phone numbers and postcodes
- **Error Handling**: User-friendly error messages and success feedback
- **Real-time Validation**: Errors clear as user types

### GoHighLevel Integration
- **Contact Creation**: Automatically creates contacts in your GHL account
- **Custom Fields**: Product type, context, estimated total, selected add-ons
- **Tags**: Automatic tagging with product and source information
- **Pipeline Support**: Optional pipeline stage assignment (configurable)

## 🔧 Configuration

### Environment Variables (`.env.local`)
```env
# Required
GHL_PRIVATE_TOKEN=pit-7299b9f4-9173-43d6-b5f9-2074b1c7dfb4
GHL_LOCATION_ID=aLTXtdwNknfmEFo3WBIX

# Optional - Pipeline Integration
GHL_PIPELINE_ID=your_pipeline_id_here
GHL_STAGE_ID=your_stage_id_here
```

### Files Created/Modified

1. **LeadCaptureForm.tsx** - Enhanced form component
2. **ghl-api.ts** - GoHighLevel API integration
3. **.env.local** - Environment configuration
4. **create.ts** - Next.js API route (for backend integration)

## 📋 Usage Examples

### Basic Usage
```tsx
import { LeadCaptureForm } from '@/components/AlarmPackage/LeadCaptureForm';

function MyPage() {
  const handleLeadSubmit = (leadData) => {
    console.log('Lead submitted:', leadData);
    // Additional handling if needed
  };

  return (
    <LeadCaptureForm 
      onSubmit={handleLeadSubmit}
      isLoading={false}
    />
  );
}
```

### With Product Context
```tsx
const productContext = {
  productType: 'Wireless',
  context: 'Residential',
  selectedAddons: ['Door Sensor', 'Motion Detector'],
  estimatedTotal: 1299
};

<LeadCaptureForm 
  onSubmit={handleLeadSubmit}
  productContext={productContext}
/>
```

## 🔒 Security Considerations

### Current Implementation (Development)
- API tokens are in the frontend code for demo purposes
- **⚠️ NOT suitable for production**

### Production Recommendations

#### Option 1: Backend API Route (Recommended)
```typescript
// pages/api/leads/create.ts (Next.js)
// OR /api/leads/create (Express.js)

export default async function handler(req, res) {
  const ghlToken = process.env.GHL_PRIVATE_TOKEN; // Server-side only
  const ghlLocationId = process.env.GHL_LOCATION_ID;
  
  // Submit to GHL from backend
  // Return success/error to frontend
}
```

#### Option 2: Serverless Function
```typescript
// netlify/functions/submit-lead.ts
// OR vercel/api/submit-lead.ts

export const handler = async (event, context) => {
  // Handle GHL submission server-side
};
```

## 🎯 GoHighLevel Data Structure

### Contact Fields
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com",
  "phone": "+61412345678",
  "address1": "123 Main St, Sydney NSW",
  "postalCode": "2000",
  "source": "Website Lead Form",
  "tags": [
    "Website Lead",
    "Product: Wireless",
    "Context: Residential"
  ],
  "customFields": {
    "product_type": "Wireless",
    "product_context": "Residential",
    "estimated_total": 1299,
    "selected_addons": "Door Sensor, Motion Detector"
  }
}
```

### Pipeline Integration (Optional)
```json
{
  "pipelineId": "your_pipeline_id",
  "stageId": "your_stage_id",
  "contactId": "contact_id_from_creation",
  "name": "Wireless Residential System - John Smith",
  "monetaryValue": 1299,
  "source": "Website Lead Form"
}
```

## 🧪 Testing

### Development Mode
The form currently uses direct API calls to GHL for testing. You can:

1. **Test with Real GHL**: Uses your actual credentials
2. **Mock Mode**: Switch to `mockSubmitLead` in `ghl-api.ts` for testing without API calls

```typescript
// In LeadCaptureForm.tsx, replace:
const { submitLeadToGHL } = await import('@/lib/ghl-api');
const result = await submitLeadToGHL(formData);

// With:
const { mockSubmitLead } = await import('@/lib/ghl-api');
const result = await mockSubmitLead(formData);
```

## 🔄 Pipeline Setup (Optional)

To automatically add leads to a specific pipeline:

1. **Get Pipeline ID**:
   - Go to GHL → Opportunities → Pipelines
   - Copy the pipeline ID from the URL

2. **Get Stage ID**:
   - Open the pipeline
   - Copy the stage ID from the URL or API

3. **Update Environment**:
   ```env
   GHL_PIPELINE_ID=your_pipeline_id
   GHL_STAGE_ID=your_first_stage_id
   ```

4. **Uncomment Pipeline Code**:
   - In `ghl-api.ts`, uncomment the pipeline integration section
   - In `create.ts` (if using backend), pipeline code is already included

## 📱 Australian Validation

### Phone Number Formats Accepted
- Mobile: `04XX XXX XXX` or `+614XXXXXXXX`
- Landline: `02 XXXX XXXX`, `03 XXXX XXXX`, etc.
- Automatically strips spaces for validation

### Postcode Validation
- Must be exactly 4 digits
- Examples: `2000`, `3000`, `4000`

## 🚀 Deployment Checklist

- [ ] Move GHL tokens to backend/serverless function
- [ ] Update form to call backend API instead of direct GHL
- [ ] Set up proper error logging
- [ ] Configure pipeline integration (if needed)
- [ ] Test with real GHL account
- [ ] Set up monitoring for failed submissions
- [ ] Add rate limiting to prevent abuse

## 🔍 Troubleshooting

### Common Issues

1. **"Server configuration error"**
   - Check `.env.local` file exists
   - Verify GHL_PRIVATE_TOKEN and GHL_LOCATION_ID are set

2. **"Invalid phone number"**
   - Ensure Australian format: `04XX XXX XXX` or `02 XXXX XXXX`
   - Check for extra characters or incorrect format

3. **"GHL API returned 401"**
   - Verify your Private Integration Token is correct
   - Check token hasn't expired

4. **"GHL API returned 400"**
   - Check Location ID is correct
   - Verify all required fields are being sent

### Debug Mode
Add this to see detailed API responses:
```typescript
console.log('GHL Response:', result);
```

## 📞 Support

For GoHighLevel API documentation:
- [GHL API Docs](https://highlevel.stoplight.io/)
- [Contact API](https://highlevel.stoplight.io/docs/integrations/)
- [Opportunities API](https://highlevel.stoplight.io/docs/integrations/)

The implementation is production-ready once you move the API tokens to a secure backend environment!