# zoho-connector

A NestJS library that provides a connector to the internal Zoho service. This library acts as a client to communicate with the Zoho microservice, abstracting away the HTTP calls and providing a type-safe interface for working with Zoho modules.

## Installation

This library is part of the monorepo. Import it in your module:

```typescript
import { ZohoInternalConnectorModule } from '@company/zoho-connector';

@Module({
  imports: [ZohoInternalConnectorModule],
  // ...
})
export class YourModule {}
```

## Environment Variables

- `MS_ZOHO_URL` - The base URL of the internal Zoho microservice (required)

## Usage

Inject the `ZohoInternalConnectorService` into your service:

```typescript
import { Injectable } from '@nestjs/common';
import { ZohoInternalConnectorService } from '@company/zoho-connector';
import { Lead, Contact, Account } from '@company/zoho-types';

@Injectable()
export class YourService {
  constructor(private readonly zohoConnector: ZohoInternalConnectorService) {}
}
```

## Available Methods

### 1. `get<T extends ZohoModules>(config: ZohoInternalGetRequest<T>): Promise<T[]>`

Retrieves multiple records from a Zoho module.

**Parameters:**

- `module`: The Zoho module name (e.g., 'Leads', 'Contacts', 'Accounts')
- `params`: Optional parameters including:
  - `fields`: Array of field names to retrieve
- `options`: Optional request options including:
  - `headers`: Custom HTTP headers

**Example:**

```typescript
// Get all leads with specific fields
const leads = await this.zohoConnector.get<Lead>({
  module: 'Leads',
  params: {
    fields: ['First_Name', 'Last_Name', 'Email', 'Phone'],
  },
});

// Get contacts with all fields
const contacts = await this.zohoConnector.get<Contact>({
  module: 'Contacts',
  params: {
    fields: ['First_Name', 'Last_Name', 'Email', 'Account_Name'],
  },
  options: {
    headers: {
      'X-Custom-Header': 'value',
    },
  },
});
```

### 2. `getById<T extends ZohoModules>(config: ZohoInternalGetByIdRequest<T>): Promise<T>`

Retrieves a single record by its ID.

**Parameters:**

- `module`: The Zoho module name
- `id`: The record ID
- `params`: Optional parameters including:
  - `fields`: Array of field names to retrieve
- `options`: Optional request options including:
  - `headers`: Custom HTTP headers

**Example:**

```typescript
// Get a specific lead by ID
const lead = await this.zohoConnector.getById<Lead>({
  module: 'Leads',
  id: '1234567890123456789',
  params: {
    fields: ['First_Name', 'Last_Name', 'Email', 'Company'],
  },
});

// Get an account with all fields
const account = await this.zohoConnector.getById<Account>({
  module: 'Accounts',
  id: '9876543210987654321',
});
```

### 3. `related<U extends ZohoModules, T extends ZohoModules>(config: ZohoInternalGetRelatedRequest<T, U>): Promise<T[]>`

Retrieves related records from a parent module.

**Parameters:**

- `module`: The parent module name
- `id`: The parent record ID
- `relatedModule`: The related module name
- `params`: Parameters including:
  - `fields`: Array of field names to retrieve
- `options`: Optional request options including:
  - `headers`: Custom HTTP headers

**Example:**

```typescript
// Get contacts related to an account
const contacts = await this.zohoConnector.related<Contact, Account>({
  module: 'Accounts',
  id: '1234567890123456789',
  relatedModule: 'Contacts',
  params: {
    fields: ['First_Name', 'Last_Name', 'Email', 'Phone'],
  },
});

// Get deals related to a contact
const deals = await this.zohoConnector.related<Deal, Contact>({
  module: 'Contacts',
  id: '9876543210987654321',
  relatedModule: 'Deals',
  params: {
    fields: ['Deal_Name', 'Amount', 'Stage', 'Closing_Date'],
  },
});
```

### 4. `create<T extends ZohoModules>(config: ZohoCreateRequest<T>): Promise<ZohoCreateResponse[]>`

Creates one or more new records in a Zoho module.

**Parameters:**

- `module`: The Zoho module name
- `data`: Array of partial record objects to create
- `options`: Optional request options including:
  - `trigger`: Array of trigger names to execute (e.g., 'workflow', 'approval', 'blueprint')
  - `headers`: Custom HTTP headers

**Example:**

```typescript
// Create a new lead
const createResponse = await this.zohoConnector.create<Lead>({
  module: 'Leads',
  data: [
    {
      First_Name: 'John',
      Last_Name: 'Doe',
      Email: 'john.doe@example.com',
      Phone: '+1234567890',
      Company: 'Example Corp',
    },
  ],
  options: {
    trigger: ['workflow'], // Optional: trigger workflows
  },
});

// Create multiple contacts
const contactsResponse = await this.zohoConnector.create<Contact>({
  module: 'Contacts',
  data: [
    {
      First_Name: 'Jane',
      Last_Name: 'Smith',
      Email: 'jane.smith@example.com',
    },
    {
      First_Name: 'Bob',
      Last_Name: 'Johnson',
      Email: 'bob.johnson@example.com',
    },
  ],
});
```

### 5. `update<T extends ZohoModules>(config: ZohoUpdateRequest<T>): Promise<T[]>`

Updates existing records in a Zoho module.

**Parameters:**

- `module`: The Zoho module name
- `data`: Array of partial record objects to update (must include ID)
- `options`: Optional request options including:
  - `trigger`: Array of trigger names to execute
  - `headers`: Custom HTTP headers

**Example:**

```typescript
// Update a lead
const updatedLead = await this.zohoConnector.update<Lead>({
  module: 'Leads',
  data: [
    {
      id: '1234567890123456789',
      Email: 'newemail@example.com',
      Phone: '+9876543210',
    },
  ],
  options: {
    trigger: ['workflow', 'approval'],
  },
});

// Update multiple accounts
const updatedAccounts = await this.zohoConnector.update<Account>({
  module: 'Accounts',
  data: [
    {
      id: '1111111111111111111',
      Account_Name: 'Updated Company Name',
    },
    {
      id: '2222222222222222222',
      Phone: '+1111111111',
    },
  ],
});
```

### 6. `upsert<T extends ZohoModules>(config: ZohoUpsertRequest<T>): Promise<T[]>`

Creates or updates records based on duplicate check fields. If a record with matching duplicate check fields exists, it will be updated; otherwise, a new record will be created.

**Parameters:**

- `module`: The Zoho module name
- `data`: Array of partial record objects
- `options`: Required options including:
  - `duplicate_check_fields`: Array of field names to use for duplicate checking
  - `trigger`: Array of trigger names to execute
  - `headers`: Custom HTTP headers

**Example:**

```typescript
// Upsert a contact based on email (create if new, update if exists)
const upsertedContact = await this.zohoConnector.upsert<Contact>({
  module: 'Contacts',
  data: [
    {
      Email: 'existing@example.com',
      First_Name: 'Updated',
      Last_Name: 'Name',
    },
  ],
  options: {
    duplicate_check_fields: ['Email'],
    trigger: ['workflow'],
  },
});

// Upsert leads based on email and company
const upsertedLeads = await this.zohoConnector.upsert<Lead>({
  module: 'Leads',
  data: [
    {
      Email: 'lead@example.com',
      Company: 'Example Corp',
      First_Name: 'John',
      Last_Name: 'Doe',
    },
  ],
  options: {
    duplicate_check_fields: ['Email', 'Company'],
    trigger: [],
  },
});
```

### 7. `search<T extends ZohoModules>(config: ZohoSearchRequest<T>): Promise<T[]>`

Searches for records in a Zoho module based on specific criteria.

**Parameters:**

- `module`: The Zoho module name
- `params`: Search parameters (query string, criteria, etc.)
- `options`: Optional request options including:
  - `headers`: Custom HTTP headers

**Example:**

```typescript
// Search for leads by email
const searchResults = await this.zohoConnector.search<Lead>({
  module: 'Leads',
  params: {
    criteria: '(Email:equals:john.doe@example.com)',
  },
});

// Search for contacts with complex criteria
const contacts = await this.zohoConnector.search<Contact>({
  module: 'Contacts',
  params: {
    criteria: '(Email:contains:example.com)',
    fields: 'First_Name,Last_Name,Email',
  },
});
```

### 8. `deleteByIds<T extends ZohoModules>(config: ZohoDeleteByIdRequest<T>)`

Deletes one or more records by their IDs.

**Parameters:**

- `module`: The Zoho module name
- `ids`: Array of record IDs to delete

**Example:**

```typescript
// Delete a single lead
await this.zohoConnector.deleteByIds<Lead>({
  module: 'Leads',
  ids: ['1234567890123456789'],
});

// Delete multiple contacts
await this.zohoConnector.deleteByIds<Contact>({
  module: 'Contacts',
  ids: ['1111111111111111111', '2222222222222222222', '3333333333333333333'],
});
```

### 9. `uploadAttachment<T extends ZohoModules>(config: ZohoUploadAttachmentRequest<T>)`

Uploads an attachment to a specific record.

**Parameters:**

- `module`: The Zoho module name
- `id`: The record ID to attach the file to
- `fileName`: The name of the file
- `rawBody`: The file content as a Buffer or stream
- `deleteExisting`: Boolean indicating whether to delete existing attachments with the same name

**Example:**

```typescript
import * as fs from 'fs';

// Upload a file attachment to a lead
const fileBuffer = fs.readFileSync('/path/to/document.pdf');
await this.zohoConnector.uploadAttachment<Lead>({
  module: 'Leads',
  id: '1234567890123456789',
  fileName: 'document.pdf',
  rawBody: fileBuffer,
  deleteExisting: false
});

// Upload from a request file (Express/Multer)
import { Express } from 'express';

async uploadFile(file: Express.Multer.File, recordId: string) {
  await this.zohoConnector.uploadAttachment<Contact>({
    module: 'Contacts',
    id: recordId,
    fileName: file.originalname,
    rawBody: file.buffer,
    deleteExisting: true // Replace existing file with same name
  });
}
```

### 10. `deleteAttachmentByName<T extends ZohoModules>(config: ZohoDeleteAttachmentByNameRequest<T>)`

Deletes an attachment from a record by its filename.

**Parameters:**

- `module`: The Zoho module name
- `id`: The record ID
- `fileName`: The name of the attachment file to delete

**Example:**

```typescript
// Delete a specific attachment from a lead
await this.zohoConnector.deleteAttachmentByName<Lead>({
  module: 'Leads',
  id: '1234567890123456789',
  fileName: 'old-document.pdf',
});
```

## Supported Zoho Modules

The connector supports all Zoho modules defined in `@company/zoho-types`, including:

- `Lead` → 'Leads'
- `Contact` → 'Contacts'
- `Account` → 'Accounts'
- `Deal` → 'Deals'
- `Quote` → 'Quotes'
- `Product` → 'Products'
- `Course` → 'Kurse'
- `Debtor` → 'Debtors'
- `Hardware` → 'Hardware'
- `HardwareRental` → 'HardwareRental'
- `Absence` → 'Absences'
- `WelcomeEvent` → 'WelcomeEvents'
- And more...

## Error Handling

All methods return promises that can be caught and handled:

```typescript
try {
  const lead = await this.zohoConnector.getById<Lead>({
    module: 'Leads',
    id: '1234567890123456789',
  });
} catch (error) {
  this.logger.error('Failed to retrieve lead', error);
  // Handle error appropriately
}
```

## Type Safety

The library is fully typed using TypeScript generics. When you specify a module type (e.g., `Lead`), the methods will:

- Enforce correct module names
- Validate field names in requests
- Return properly typed responses
- Provide IntelliSense support in your IDE

## Running Tests

Run unit tests with:

```bash
nx test zoho-connector
```

## Notes

- This connector communicates with an internal Zoho microservice, not directly with Zoho's API
- The `MS_ZOHO_URL` environment variable must be set for the service to work
- All methods are asynchronous and return Promises
- The service uses NestJS's `HttpService` for HTTP communication
- File uploads use `form-data` for multipart/form-data requests
