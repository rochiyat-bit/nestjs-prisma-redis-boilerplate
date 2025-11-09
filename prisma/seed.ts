import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
      todos: {
        create: [
          {
            title: 'Welcome to NestJS Boilerplate',
            description: 'This is a demo todo item',
            completed: false,
          },
          {
            title: 'Check out the API documentation',
            description: 'Visit /api/docs to see Swagger documentation',
            completed: false,
          },
          {
            title: 'Completed task example',
            description: 'This todo is already completed',
            completed: true,
          },
        ],
      },
    },
  });

  console.log('Seed completed successfully!');
  console.log('Demo user created:', user.email);
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
