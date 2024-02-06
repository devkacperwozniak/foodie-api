#### temporary - test purpose
docker compose -f local.docker-compose.yml --env-file dev.env up --build  

### How to generate service account for Google Storage in appropriate location:
1. Run `gcloud iam service-accounts keys create /home/$USER/docker-to-storage/keyfile.json --iam-account docker-to-storage@foodie-407891.iam.gserviceaccount.com && sudo mv /home/$USER/docker-to-storage /home`


### How to run development environment:
!! Caution: make sure that you generated service account in appropriate location (see above).
1. Run `cp .env.example .env` 
2. Fill `SMTP_PASSWORD` in `.env`  
3. Run `npm install`
3. Run `docker compose up --build`
