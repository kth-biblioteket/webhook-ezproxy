# Webhook som anropas av Github Actions för att Uppdatera EZProxys config.txt

- Anropet verfieras via en "webhook secret" för repositoriet
- Tjänsten kör ett script som gör en "git pull", i ezproxys folder, mot ezproxy repositoriet.

## Dokumentation

- Skapa en .env med parametrar
    WEBHOOK_SECRET=xxxxxxxxxxxxx
    PORT=9000
    GITHUB_WEBHOOK_HASHALG=SHA256
    GITHUB_WEBHOOK_SIGNATURE_HEADER=x-hub-signature-256
    GITHUB_DEPLOY_SCRIPT=/app/ezpconf.sh
    ACTIONEVENT=ezproxyupdate

- Skapa docker-compose-fil
    