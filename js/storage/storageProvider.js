import { appConfig } from '../../config.js';
import { localDb } from './localDb.js';

const remoteStub = {
  async load() { throw new Error('Modo remoto no configurado'); },
  async save() { throw new Error('Modo remoto no configurado'); },
  async clear() { throw new Error('Modo remoto no configurado'); }
};

export const storageProvider = (appConfig.syncMode === 'remote' && appConfig.remote.url && !appConfig.remote.url.includes('YOUR_PROJECT'))
  ? remoteStub
  : localDb;
