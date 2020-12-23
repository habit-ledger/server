// tslint:disable
import * as helmet from 'helmet';

import { ValidationPipe, INestApplication } from '@nestjs/common';

function defaultValidationPipe() {
  return new ValidationPipe({
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    transform: true,
  });
}

export function setupDefaultApp(app: INestApplication) {
  app.use(helmet());
  app.useGlobalPipes(defaultValidationPipe());
  app.enableShutdownHooks();
  app.enableCors({ origin: '*', preflightContinue: false });
}

