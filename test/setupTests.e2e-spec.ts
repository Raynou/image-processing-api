import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Client } from 'pg';
import { PrismaService } from './../src/prisma/prisma.service';
import { execSync } from 'child_process';

/**
 * This is a first approach of a Testcontainers integration in e2e tests.
 * This is the reference used to code this file:
 * https://blog.stackademic.com/improving-integration-e2e-testing-using-nestjs-and-testcontainers-4a815142d147
 * 
 * Nevertheless, We've found a simple way to implement this:
 * https://github.com/andredesousa/nest-postgres-testcontainers/blob/main/e2e/specs/app.spec.ts
 * 
 * It's important to say that add Testcontainers in e2e enchances the application's test & reduces
 * the risk to find bugs in production but it adds complexity on the CI/CD pipeline as it's needed to use
 * a Docker-in-Docker runner to execute such tests. Answer the follwing questions:
 * 
 * - If e2e test cases are going to be executed in CI, what's the point of execute them in development? It improves
 * the development experience (faster feedback, improved debugging experience)
 */

let postgresContainer: StartedPostgreSqlContainer;
let postgresClient: Client;
let prismaService: PrismaService;

beforeAll(async () => {
    postgresContainer = await new PostgreSqlContainer('postgres').start();

    postgresClient = new Client({
        host: postgresContainer.getHost(),
        port: postgresContainer.getPort(),
        database: postgresContainer.getDatabase(),
        user: postgresContainer.getUsername(),
        password: postgresContainer.getPassword()
    });

    await postgresClient.connect();

    const databaseUrl = `postgresql://${postgresClient.user}:${postgresClient.password}@${postgresClient.host}:${postgresClient.port}/${postgresClient.database}`;

    execSync('npx prisma migrate dev', { env: { DATABASE_URL: databaseUrl } });

    prismaService = new PrismaService({
        datasources: {
            db: {
                url: databaseUrl
            },
        },
        log: ['query']
    });
    console.log('Connected to test db...');
});

afterAll(async () => {
    await postgresClient.end();
    await postgresContainer.stop();
    console.log('Test db stopped...');
});

jest.setTimeout(8000);
export { postgresClient, prismaService };