# Asset Management Backend

## Run service on localhost

- Default url [http://localhost:8002](http://localhost:8002)
- Swagger [http://localhost:8002/docs](http://localhost:8002/docs)

## Running the app locally on your OS

- You can run the app against your OS if you think it will be quicker development.

```bash
docker compose up -d
npm install
npm run dev
```

- The other option would be to run it on docker which gets you an environment that is much closer to what runs in the remote environment. See below.

## Functionality overview

The example application is simple asset management sevice. It handle sync daily asset status in activated organization location

**General functionality:**

- Synchronize assets from BR Company to the database:
  - Sync in midnight
  - Synchronize assets when the location already exists in the database and is active
  - Only sync assets created in the past.
- Get list assets
- Get list organizations

**Main Modules:**
- AssetModule: Responsible for managing assets.
- OrganizationModule: Responsible for managing organizations.
- ExternalModule: Handles integration with third-party services.
- SchedulerModule: Handles daily asset cron jobs.
