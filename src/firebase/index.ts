// src/firebase/index.ts
import { firebaseConfig, Environment } from './config';
import { initializeApp, FirebaseApp, deleteApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';

class FirebaseService {
  private static instance: FirebaseService;
  private app: FirebaseApp | null = null;
  private db: Database | null = null;
  private currentEnv: Environment = 'test';
  private auth: Auth | null = null;
  private constructor() {}

  static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // Environment = TEST
  initialize(env: Environment = 'test'): void {
    try {
      this.app = initializeApp(firebaseConfig[env]);
      this.db = getDatabase(this.app);
      this.auth = getAuth(this.app);
      console.log('Auth initialized:', firebaseConfig[env].authDomain);
      this.currentEnv = env;
      console.log(`Firebase initialized in ${env} mode`);
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }

  // Switch Release
  async switchEnvironment(env: Environment): Promise<void> {
    if (this.currentEnv === env) {
      console.log('Already in', env, 'environment');
      return;
    }

    try {
      if (this.app) {
        await deleteApp(this.app);
        this.app = null;
        this.db = null;
        this.auth = null; // Auth 추가
      }
      this.initialize(env);
    } catch (error) {
      console.error('Error switching environment:', error);
    }
  }

  getDatabase(): Database | null {
    return this.db;
  }

   // Auth getter 추가
   getAuth(): Auth | null {
    return this.auth;
  }


  getCurrentEnvironment(): Environment {
    return this.currentEnv;
  }
}

export const firebaseService = FirebaseService.getInstance();