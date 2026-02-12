import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { DataSource } from 'typeorm';
import { WORKFLOW_QUEUE } from '../workflow/workflow.constants';

@Injectable()
export class HealthService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectQueue(WORKFLOW_QUEUE) private readonly workflowQueue: Queue,
    private readonly configService: ConfigService,
  ) {}

  async check() {
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'unknown',
        redis: 'unknown',
        gemini: 'configured',
      },
    };

    try {
      await this.dataSource.query('SELECT 1');
      health.services.database = 'healthy';
    } catch {
      health.services.database = 'unhealthy';
      health.status = 'degraded';
    }

    try {
      await this.workflowQueue.waitUntilReady();
      health.services.redis = 'healthy';
    } catch {
      health.services.redis = 'unhealthy';
      health.status = 'degraded';
    }

    const geminiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!geminiKey) {
      health.services.gemini = 'not configured';
      health.status = 'degraded';
    }

    return health;
  }
}
