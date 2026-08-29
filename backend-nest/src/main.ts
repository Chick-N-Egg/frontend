import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Chick API')
    .setDescription(
      'Brief → Result → Attempt GTM discovery API. Reachable through the ' +
        'frontend-react Caddy proxy at /api/docs, or directly on this ' +
        "service's own port at /docs.",
    )
    .setVersion('0.1.0')
    .addTag('briefs', 'Step 1-2: intake and confirmation')
    .addTag('discovery', 'Step 2-3: channel matching and confidence scoring')
    .addTag('outreach', 'Step 4: outreach kit generation')
    .addTag('attempts', 'Step 5: outreach outcome tracking')
    .addTag('dashboard', 'Aggregated KPIs and refinement insight')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  await app.listen(port);
}
bootstrap();
