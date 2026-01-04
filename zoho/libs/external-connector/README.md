# zoho-external-connector

A NestJS Library to connect to the external Zoho Rest-API

## env

- ZOHO_CRM_ACCESS_TOKEN
- ENV ???
- MAX_CONCURRENT
- ZOHO_CRM_CLIENT_ID
- ZOHO_CRM_CLIENT_SECRET
- ZOHO_CRM_REFRESH_TOKEN

TODO:  
...add more details on usage and Types

## Zoho OpenAuth2.0

To connect to the ZOHO API an Access-Token is required.

For more details see the Docs:  
https://www.zoho.com/crm/developer/docs/api/v7/  
https://www.zoho.com/crm/developer/docs/api/v7/scopes.html  
https://www.zoho.com/crm/developer/docs/api/v7/select-api-scopes.html  
https://www.zoho.com/crm/developer/docs/api/v7/get-records.html

### 1 ) generate a Base-specific Authorisation Code

from: https://api-console.zoho.eu/ (use or create a Self Client)

- Client ID: {CLIENT_ID}
- Client Secret: {CLIENT_SECRET}

### 2 ) generate a Authorisation Code für Scopes and Portal/org

(i.e: CRM/Staging - New Absences )

used scopes (for dev):

    ZohoCRM.modules.ALL,ZohoCRM.settings.modules.READ,ZohoCRM.org.READ

### 3 ) use Authorisation Code to get the refresh_token (and an access-Token)

You have to do this in the given timelimit.

```console
curl \
--location 'https://accounts.zoho.eu/oauth/v2/token' \
--form 'client_id="1000.{CLIENT_ID}"' \
--form 'client_secret="{CLIENT_SECRET}"' \
--form 'code="{AUTHCODE_FROM_ABOVE}"' \
--form 'grant_type="authorization_code"'
```

response:

    {
      "access_token":"{ACCESS_TOKEN}",
      "refresh_token":"{REFRESH_TOKEN}",
      "scope":"ZohoCRM.modules.ALL ZohoCRM.settings.modules.READ ZohoCRM.org.READ",
      "api_domain":
      "https://www.zohoapis.eu",
      "token_type":"Bearer",
      "expires_in":3600
    }

### 4 ) get a new Access Token anytime

```console
curl \
--location 'https://accounts.zoho.eu/oauth/v2/token' \
--form 'client_id="1000.{CLIENT_ID}"' \
--form 'client_secret="{CLIENT_SECRET}"' \
--form 'refresh_token="{REFRESH_TOKEN}"' \
--form 'grant_type="refresh_token"'
```

### 5 ) get some Data using the Access Token

```console
curl "https://www.zohoapis.eu/crm/v7/Leads?fields=Last_Name,Email,Record_Status__s,Converted__s,Converted_Date_Time&converted=true&per_page=5" \
-H "Authorization: Zoho-oauthtoken {ACCESS_TOKEN}"
```
