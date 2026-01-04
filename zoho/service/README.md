# Zoho Service

## Description

The Zoho Service is a NestJS microservice that provides a REST API interface to interact with Zoho CRM. It acts as a proxy layer between internal services and the Zoho CRM API, handling authentication, rate limiting, and request management. The service provides CRUD operations, search capabilities, and attachment management for various Zoho CRM modules.

## Core Functionality

The service provides the following core functionality:

- **CRUD Operations**: Create, read, update, and delete records for Zoho CRM modules (Deals, Contacts, Accounts, Quotes, Products, etc.)
- **Search**: Advanced search capabilities across Zoho CRM modules with filtering and pagination
- **Related Records**: Retrieve related records from connected modules
- **Attachments**: Upload and manage file attachments for Zoho CRM records
- **Rate Limiting**: Built-in rate limiting to handle Zoho CRM API constraints and prevent request throttling
- **Authentication**: Automatic OAuth token management with refresh token handling
- **Environment Management**: Support for multiple Zoho CRM organizations through environment-specific configuration

The service integrates with:

- Zoho CRM API (European region: `https://www.zohoapis.eu/crm/`)
- Internal microservices via REST API

## Environment Variables

| Variable                 | Description                                                                        | Default                        | Required |
| ------------------------ | ---------------------------------------------------------------------------------- | ------------------------------ | -------- |
| `NODE_ENV`               | Node.js environment mode (development/production)                                  | `development`                  | No       |
| `SERVICE_PORT`           | Port number for the service to listen on                                           | `3000`                         | No       |
| `SERVICE_NAME`           | Name of the service (used in Swagger documentation)                                | -                              | No       |
| `GLOBAL_PREFIX`          | Global API prefix for all endpoints                                                | -                              | No       |
| `API_PREFIX`             | API version prefix                                                                 | -                              | No       |
| `API_VERSION`            | API version number                                                                 | -                              | No       |
| `ENABLE_SWAGGER`         | Enable Swagger API documentation UI                                                | -                              | No       |
| `ZOHO_CRM_BASE_URL`      | Base URL for Zoho CRM API                                                          | `https://www.zohoapis.eu/crm/` | No       |
| `ZOHO_CRM_API_VERSION`   | Zoho CRM API version                                                               | `v7`                           | No       |
| `ZOHO_CRM_CLIENT_ID`     | Zoho CRM OAuth client ID                                                           | -                              | Yes      |
| `ZOHO_CRM_CLIENT_SECRET` | Zoho CRM OAuth client secret                                                       | -                              | Yes      |
| `ZOHO_CRM_SOID`          | Zoho CRM Organization ID (SOID) - determines which Zoho organization to connect to | -                              | Yes      |
| `ZOHO_CRM_REFRESH_TOKEN` | Zoho CRM OAuth refresh token (optional, used for token refresh)                    | -                              | No       |
| `ZOHO_CRM_ACCESS_TOKEN`  | Pre-set Zoho CRM access token (optional, mainly for development/testing)           | -                              | No       |
| `ENV`                    | Environment identifier (used for document prefix, e.g., 'DEV' for development)     | -                              | No       |
| `MAX_CONCURRENT`         | Maximum number of concurrent requests to Zoho CRM API                              | `15`                           | No       |

**Important Note**: The `ZOHO_CRM_SOID` variable is critical for environment management. It determines which Zoho CRM organization the service connects to. Different values should be used for development and production environments.

## API Documentation

When Swagger is enabled (via `ENABLE_SWAGGER=true`), you can access the interactive API documentation at:

```
http://localhost:{SERVICE_PORT}/api
```

The Swagger UI provides:

- Complete list of available endpoints
- Request/response schemas
- Interactive API testing capabilities
- Authentication requirements

## Project Dependencies

To visualize the project dependencies and understand how this service relates to other projects in the workspace, use the Nx graph:

```bash
nx graph
```

Or use the Nx VS Code extension to view the dependency graph interactively. This will show:

- Dependencies on other libraries (zoho-api, zoho-external-connector, zoho-types)
- Projects that depend on this service (zoho-application-service, etc.)
- The overall project architecture

## Running the Service

### Development Environment

To run the service in development mode using the Nx VS Code extension:

1. **Set Environment Variables**: Ensure you have a `.env.development` file in `projects/zoho/service/` with the following:

```env
NODE_ENV=development
SERVICE_PORT=3002
SERVICE_NAME=zoho-service
GLOBAL_PREFIX=api
API_PREFIX=v
API_VERSION=1
ENABLE_SWAGGER=true

# Zoho CRM Configuration
ZOHO_CRM_BASE_URL=https://www.zohoapis.eu/crm/
ZOHO_CRM_API_VERSION=v7
ZOHO_CRM_CLIENT_ID=your_client_id
ZOHO_CRM_CLIENT_SECRET=your_client_secret
ZOHO_CRM_SOID=your_development_soid
```

**Important**: Set the `ZOHO_CRM_SOID` to your development Zoho CRM organization ID.

2. **Run via Nx VS Code Extension**:
   - Open the Nx sidebar in VS Code
   - Find `zoho-service` in the project list
   - Right-click and select "Run Target" → `serve` → `development`
   - The service will start and be available at `http://localhost:3002/api/v1/zoho`

### Production Environment

To run the service in production mode using the Nx VS Code extension:

1. **Set Environment Variables**: Ensure you have a `.env.production` file in `projects/zoho/service/` with the following:

```env
NODE_ENV=production
SERVICE_PORT=3000
SERVICE_NAME=zoho-service
GLOBAL_PREFIX=api
API_PREFIX=v
API_VERSION=1
ENABLE_SWAGGER=false

# Zoho CRM Configuration
ZOHO_CRM_BASE_URL=https://www.zohoapis.eu/crm/
ZOHO_CRM_API_VERSION=v7
ZOHO_CRM_CLIENT_ID=your_client_id
ZOHO_CRM_CLIENT_SECRET=your_client_secret
ZOHO_CRM_SOID=your_production_soid
```

**Important**: Set the `ZOHO_CRM_SOID` to your production Zoho CRM organization ID. This is different from the development SOID.

2. **Run via Nx VS Code Extension**:
   - Open the Nx sidebar in VS Code
   - Find `zoho-service` in the project list
   - Right-click and select "Run Target" → `serve` → `production`
   - The service will start and be available at `http://localhost:3000/api/v1/zoho`

### Environment File Structure

The service supports multiple environment files that are loaded in the following order:

| File               | When Loaded                                   | Purpose                                                   |
| ------------------ | --------------------------------------------- | --------------------------------------------------------- |
| `.env`             | Always                                        | Base environment variables shared across all environments |
| `.env.development` | When running with `development` configuration | Development-specific variables                            |
| `.env.production`  | When running with `production` configuration  | Production-specific variables                             |
| `.env.local`       | Always (if exists)                            | Personal secrets and overrides (excluded from git)        |

**Note**: The `.env.local` file is excluded from git and should be used for personal secrets and local overrides.

### Using Nx CLI (Alternative)

You can also run the service using the Nx CLI:

```bash
# Development
nx serve zoho-service --configuration=development

# Production
nx serve zoho-service --configuration=production
```

## Additional Notes

- The service automatically handles OAuth token refresh when using client credentials flow
- Rate limiting is built-in to prevent exceeding Zoho CRM API limits
- All requests are logged for debugging purposes
- The service supports pagination for large result sets automatically
