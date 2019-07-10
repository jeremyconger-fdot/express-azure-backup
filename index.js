const axios = require('axios');
const expressAzureBackup = (optionsConfiguration) => {
    return (req, res, next) => {
        let options = {
            tenantName: process.env.TENANT_NAME,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            subscriptionId: process.env.subscriptionId,
            resourceGroupName: process.env.resourceGroupName,
            vaultName: process.env.vaultName,
            fabricName: process.env.fabricName,
            containerName: process.env.containerName,
            protectedItemName: process.env.protectedItemName,
        }

        if (optionsConfiguration) {
            options = {
                ...options,
                ...optionsConfiguration
            };
        }

        var authUrl = `https://login.microsoftonline.com/${options.tenantName}/oauth2/token`;
        var body = `grant_type=client_credentials&client_id=${options.clientId}&client_secret=${options.clientSecret}&resource=https%3A%2F%2Fmanagement.azure.com%2F`;

        axios.post(authUrl, body)
            .then(authResponse => {
                //console.log(authResponse.data);
                let backupUrl = `https://management.azure.com/Subscriptions/${options.subscriptionId}/resourceGroups/${options.resourceGroupName}/providers/Microsoft.RecoveryServices/vaults/${options.vaultName}/backupFabrics/${options.fabricName}/protectionContainers/${options.containerName}/protectedItems/${options.protectedItemName}/backup?api-version=2016-12-01`;
                let config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'bearer ' + authResponse.data.access_token
                    }
                };

                let date = new Date();
                date.setDate(date.getDate() + 2);

                axios.post(backupUrl, {
                    "properties": {
                        "objectType": "AzureFileShareBackupRequest",
                        "recoveryPointExpiryTimeInUTC": date.toISOString()
                    }
                }, config).then(backupResponse => {
                    let timer = setInterval(() => {
                        axios.get(backupResponse.headers['azure-asyncoperation'], config).then(jobResponse => {
                            if (jobResponse.data.status === 'Succeeded') {
                                clearInterval(timer);
                                next();
                            }
                        })
                    }, 2000);
                }).catch(error => {
                    console.log('Error', error.message);
                    res.status(500).send(error.message);
                });
            }).catch(error => {
                console.log('Error', error.message);
                res.status(500).send(error.message);
            });
    }
}

module.exports = expressAzureBackup;