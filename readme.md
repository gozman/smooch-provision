# Smooch-Provision

In some architectures, the Smooch app creation API cannot be called directly by an application as this would require sharing account credentials with an untrusted party.

This project demonstrates a serverless function for creating apps and associated access keys without exposing the superuser account credentials to the untrusted party.

To deploy:

1. Set the relevant account key, account secret and authCode values in serverless.yml. `authCode` is a unique string you define for securing access to this API. If it is compromised, anyone will be able to provision Smooch apps on your account. However, no data will be lost or accessible.
2. `npm install`
3. `serverless deploy`
4. POST to the `/apps/create` endpoint with an app `name` and `authCode` specified in the query string.

NOT PRODUCTION QUALITY - POC ONLY
