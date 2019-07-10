# @FDOT/express-azure-backup

An express middleware that can be used to kickoff an azure backup job. It will wait until an success is returned from the job execution before it calls next().

### Example
``` javascript
const expressAzureBackup = require('@fdot/express-azure-backup');
router.post('/api/v1/User/Replace/:originalUserId/:replacementUserId', expressAzureBackup(), replaceUser]);
```

### Configuration
Default Options
``` javascript
let options = { tenantName: process.env.TENANT_NAME,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    subscriptionId: process.env.subscriptionId,
    resourceGroupName: process.env.resourceGroupName,
    vaultName: process.env.vaultName,
    fabricName: process.env.fabricName,
    containerName: process.env.containerName,
    protectedItemName: process.env.protectedItemName,
    }
```