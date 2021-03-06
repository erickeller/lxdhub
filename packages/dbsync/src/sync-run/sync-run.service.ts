import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SyncRun, SyncState } from '@lxdhub/db';
import { Repository } from 'typeorm';

@Injectable()
export class SyncRunService {
  constructor(
    @InjectRepository(SyncRun)
    private readonly syncRunRepository: Repository<SyncRun>
  ) {}
  private findOne(id: number) {
    return this.syncRunRepository.findOne({ where: { id } });
  }

  createSyncRun(): Promise<SyncRun> {
    const syncRun = new SyncRun();
    return this.syncRunRepository.save(syncRun);
  }

  async startSyncRun(id: number): Promise<SyncRun> {
    const syncRun = await this.findOne(id);
    syncRun.state = SyncState.RUNNING;
    syncRun.started = Date.now();
    return syncRun.save();
  }

  async failSyncRun(id: number, message: string): Promise<SyncRun> {
    const syncRun = await this.findOne(id);
    syncRun.state = SyncState.FAILED;
    syncRun.error = message;
    syncRun.ended = Date.now();
    return syncRun.save();
  }

  async finishSyncRun(id: number): Promise<SyncRun> {
    const syncRun = await this.findOne(id);
    syncRun.state = SyncState.SUCCEEDED;
    syncRun.ended = Date.now();
    return syncRun.save();
  }

  async resetAllSyncStates(): Promise<SyncRun[]> {
    const currentlyRunningSyncs = await this.getCurrentlyRunningSyncs();
    const promises = currentlyRunningSyncs.map(currentlyRunning =>
      this.failSyncRun(currentlyRunning.id, 'Forcefully stopped')
    );
    return Promise.all(promises);
  }

  getCurrentlyRunningSyncs(): Promise<SyncRun[]> {
    return this.syncRunRepository.find({ where: { state: SyncState.RUNNING } });
  }
}
