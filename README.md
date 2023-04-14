# sharepoint-rest-auth
Package for easier authentication to sharepoint rest api with app registration and certificate

# Install
```bash
npm i @vtfk/sharepoint-rest-auth
```

# Prerequisities
- An app registration with permission to Sharepoint API
- A certificate with private key in either PEM or PFX format (PFX recommended, can e.g. be created in an azure keyvault)

## Add certificate to app registration
- Go to app registrations "secrets and certificates"
- Upload the certficate
- Copy the thumbprint of the certificate

# Usage
```js
const spToken = require('@vtfk/sharepoint-rest-auth')

// PFX version
const authOptionsPfx = {
    thumbprint: THUMBPRINT, // Certificate thumbprint
    pfxcert: PFX_CERT_AS_BASE64, // PFX cert as base64
    privateKeyPassphrase: PFX_PRIVATE_KEY_PASSPHRASE || null, // password for private key if needed
    clientId: CLIENT_ID, // app reg client id
    tenantId: TENANT_ID,  // tenant id
    tenantName: TENANT_NAME // tenant name
}

// PEM version
const authOptionsPem = {
    thumbprint: THUMBPRINT, // Certificate thumbprint
    pemcert: PEM_CERT_AS_BASE64, // PEM cert as base64
    pemprivateKey: PEM_PRIVATE_KEY_AS_BASE64,
    clientId: CLIENT_ID, // app reg client id
    tenantId: TENANT_ID, // tenant id
    tenantName: TENANT_NAME // tenant name
}

const token = await spToken(authOptionsPfx || authOptionsPem)

```


