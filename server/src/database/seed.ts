import { UserEntity } from '../users/entity/user.entity';
import { ProfileEntity } from '../users/entity/profile.entity';
import { hashPassword } from '../utils/helpers';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [UserEntity, ProfileEntity],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
});

dataSource
  .initialize()
  .then(async () => {
    console.log('Data Source for seeding has been initialized!');
    console.log('Seeding data started...');
    console.time('seeding-data-timer');
    await seed();
    console.timeEnd('seeding-data-timer');
    console.log('Seeding data completed!');
  })
  .catch((error) => {
    console.error('Error during Data Source initialization for seeding', error);
  });

async function seed() {
  try {
    return await dataSource.transaction(async (transactionalEntityManager) => {
      let index = 0;
      while (index < 1000) {
        const password = await hashPassword(`password-${index}`);
        const email = `john.doe${index}@example.com`;
        const name = `John Doe ${index}`;
        const user = transactionalEntityManager.create(UserEntity, {
          name,
          email,
          password,
        });
        await transactionalEntityManager.save(user);
        const profile = transactionalEntityManager.create(ProfileEntity, {
          bio: `hello ${name}`,
        });
        await transactionalEntityManager.save(profile);
        index++;
      }
      console.log(`${index} users and profiles created`);
    });
  } catch (error) {
    console.error('Error during seeding', error);
    throw error;
  }
}
