import {PrismaClient} from '@prisma/client';
import {ORGANIZATION_LOCATION_DATA} from './data';

const prisma = new PrismaClient();

async function seedOrganizationData() {
  console.log('Seeding Organization Data');
  const organizationMap = new Map();
  const locations = [];
  for (const organizationLocation of ORGANIZATION_LOCATION_DATA) {
    const organization = organizationMap.get(organizationLocation.organization);
    const location = {
      locationId: organizationLocation.location_id,
      name: organizationLocation.location_name,
      status: organizationLocation.status,
    };
    // push location to organization
    if (!organization) {
      organizationMap.set(organizationLocation.organization, {
        name: organizationLocation.organization,
        locations: [location],
      });
    } else {
      organizationMap.set(organizationLocation.organization, {
        ...organization,
        locations: [...organization.locations, location],
      });
    }

    // push location to locations
    if (!locations.find((l) => l.locationId === location.locationId)) {
      locations.push(location);
    }
  }

  // create organization and releated locations
  await prisma.$transaction(async (trx) => {
    await trx.location.createMany({
      data: locations.map((location) => ({
        id: location.locationId,
        name: location.name,
      })),
    });
    for (const [organizationName, organization] of organizationMap) {
      await trx.organization.create({
        data: {
          name: organizationName,
          organizationLocations: {
            create: organization.locations.map((location) => ({
              locationId: location.locationId,
              status: location.status,
            })),
          },
        },
      });
    }
  });

  console.log('Finished Seeding Organization Data');
}

const load = async () => {
  try {
    await seedOrganizationData();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
