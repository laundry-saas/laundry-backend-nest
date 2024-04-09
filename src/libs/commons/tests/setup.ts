import {
    CanActivate,
  ExecutionContext,
  INestApplication,
  Injectable,
  Provider,
  VERSION_NEUTRAL,
  VersioningType,
} from '@nestjs/common';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { generateSampleUser, generateSampleUserPayload } from 'src/modules/auth/tests/testSetup';

@Injectable()
export class MockAuthGuard implements CanActivate {
    private readonly mockUser: User;

  constructor(user: User) {
    this.mockUser = user || generateSampleUserPayload();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    request.user = await generateSampleUser(this.mockUser);
    return true; // Always allow the request to pass through
  }
} 

interface TestAppConfig {
  imports: any[];
  controllers?: any[];
  providers: Provider[];
  mockAuthGuard?: boolean;
  testUser?: User;
}

export default async function createTestApp(config: TestAppConfig) {
  let module: TestingModule;
  const {
    imports,
    controllers,
    providers,
    testUser,
    mockAuthGuard = true,
  } = config;
  const moduleBuilder: TestingModuleBuilder = await Test.createTestingModule({
    imports,
    controllers,
    providers,
  });

  if (mockAuthGuard) {
    module = await moduleBuilder
      .overrideGuard(JwtAuthGuard)
      .useValue(new MockAuthGuard(testUser))
      .compile();
  } else {
    module = await moduleBuilder.compile();
  }

  const app = module.createNestApplication();
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: [VERSION_NEUTRAL, '1'],
  });

  await app.init();
  return app as INestApplication<any>;
}
