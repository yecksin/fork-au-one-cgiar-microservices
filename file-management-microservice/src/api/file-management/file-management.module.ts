import { Module } from '@nestjs/common';
import { FileManagementService } from './file-management.service';
import { FileManagementController } from './file-management.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  controllers: [FileManagementController],
  providers: [FileManagementService],
  imports: [NotificationsModule],
})
export class FileManagementModule {}
