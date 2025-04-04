// src/firebase/config.ts
export type Environment =  'test' | 'release'; // 'release' 추가

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    storageBucket: string;
}

// FIREBASE CONFIG API KEY: PRIVATE -> DEV : TEST, BUILD: RELEASE
export const firebaseConfig: Record<Environment, FirebaseConfig> = {
    release: {
      apiKey: "AIzaSyDFLXGv0khe48B_rF7NJYINLi2y3yEtGCA",
      authDomain: "patient-management-release.firebaseapp.com",
      databaseURL: "https://patient-management-release-default-rtdb.asia-southeast1.firebasedatabase.app/",
      storageBucket: "patient-management-release.firebasestorage.app",
    },
    test: {
      apiKey: "AIzaSyCAPHnkqlRpUlV9Y16fC7t57juJ6PpgdRc",
      authDomain: "patient-management-test.firebaseapp.com",
      databaseURL: "https://patient-management-test-default-rtdb.asia-southeast1.firebasedatabase.app",
      storageBucket: "patient-management-test.firebasestorage.app"
    }
  };