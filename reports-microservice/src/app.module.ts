import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { routes as mainRoutes } from './domain/routes/main.routes';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { PdfModule } from './domain/api/pdf/pdf.module';

@Module({
  imports: [PdfModule, RouterModule.register(mainRoutes)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
