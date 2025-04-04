// src/firebase/auth.ts
import {
    signInWithEmailAndPassword,
    signOut,
    User,
    createUserWithEmailAndPassword
  } from 'firebase/auth';
  import { ref, get, set } from 'firebase/database';
  import { firebaseService } from './index';
  import { DB_PATHS, HospitalUser, Hospital } from './type';
  
  // 회원가입 시 필요한 데이터 타입
  interface SignUpData {
    email: string;
    password: string;
    hospitalName: string;
    departmentName: string;
  }
  
  export const authService = {
    // 회원가입
    async signUp({ email, password, hospitalName, departmentName }: SignUpData) {
        const auth = firebaseService.getAuth();
        const db = firebaseService.getDatabase();
        if (!auth || !db) throw new Error('Firebase not initialized');
      
        try {
          // 1. Firebase Auth로 사용자 생성
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const userId = userCredential.user.uid;
          console.log('Created user:', userId);
      
          // 2. 병원 정보 생성
          const hospitalId = `hospital-${Date.now()}`;
          const departmentId = `dept-${Date.now()}`;
          console.log('Generated IDs:', { hospitalId, departmentId });
          
          const hospitalData: Hospital = {
            id: hospitalId,
            name: hospitalName,
            departments: {
              [departmentId]: {
                id: departmentId,
                name: departmentName
              }
            },
            createdAt: Date.now(),
          };
      
          // 3. 사용자 정보 생성
          const userData: HospitalUser = {
            email,
            hospitalId,
            departmentId,
            hospitalName,
            departmentName,
            role: 'user',
            createdAt: Date.now()
          };
      
          console.log('Saving hospital data:', hospitalData);
          console.log('Saving user data:', userData);
      
          // 4. DB에 저장
          try {
            await set(ref(db, `${DB_PATHS.HOSPITALS}/${hospitalId}`), hospitalData);
            console.log('Hospital data saved');
          } catch (error) {
            console.error('Error saving hospital data:', error);
          }
      
          try {
            await set(ref(db, `${DB_PATHS.USERS}/${userId}`), userData);
            console.log('User data saved');
          } catch (error) {
            console.error('Error saving user data:', error);
          }
      
          return {
            user: userCredential.user,
            hospitalData,
            userData
          };
        } catch (error) {
          console.error('SignUp error:', error);
          throw error;
        }
      },
  
    // 로그인 (기존 함수 수정)
    async login(email: string, password: string) {
      const auth = firebaseService.getAuth();
      if (!auth) throw new Error('Auth not initialized');
  
      try {
        // 1. Firebase Auth로 로그인
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // 2. 사용자의 병원 정보 가져오기
        const userData = await this.getUserHospital(userCredential.user.uid);
        if (!userData) throw new Error('User hospital data not found');
  
        // 3. 병원 정보 가져오기
        const hospitalData = await this.getHospitalData(userData.hospitalId);
        if (!hospitalData) throw new Error('Hospital data not found');
  
        return {
          user: userCredential.user,
          userData,
          hospitalData
        };
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
  
    // 로그아웃
    async logout() {
      const auth = firebaseService.getAuth();
      if (!auth) throw new Error('Auth not initialized');
      
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    },
  
    // 현재 로그인된 사용자 정보 가져오기
    getCurrentUser(): User | null {
      const auth = firebaseService.getAuth();
      return auth?.currentUser ?? null;
    },
  
    // 사용자의 병원 정보 가져오기 (수정)
    async getUserHospital(userId: string): Promise<HospitalUser | null> {
        const db = firebaseService.getDatabase();
        if (!db) throw new Error('Database not initialized');
        
        try {
        // 1. 먼저 사용자 정보 가져오기
        const userRef = ref(db, `${DB_PATHS.USERS}/${userId}`);
        const userSnapshot = await get(userRef);
        
        if (!userSnapshot.exists()) return null;
        const userData = userSnapshot.val();
        
        // 2. 병원 정보 가져오기
        const hospitalRef = ref(db, `${DB_PATHS.HOSPITALS}/${userData.hospitalId}`);
        const hospitalSnapshot = await get(hospitalRef);
        
        if (!hospitalSnapshot.exists()) return null;
        const hospitalData = hospitalSnapshot.val();
        
        // 3. 부서 정보 가져오기
        const departmentData = hospitalData.departments[userData.departmentId];
        
        // 4. 모든 정보 합치기
        return {
            ...userData,
            hospitalName: hospitalData.name,
            departmentName: departmentData.name
        };
        
        } catch (error) {
        console.error('Error getting user hospital:', error);
        throw error;
        }
    },
  
    // 병원 정보 가져오기
    async getHospitalData(hospitalId: string): Promise<Hospital | null> {
      const db = firebaseService.getDatabase();
      if (!db) throw new Error('Database not initialized');
  
      try {
        const hospitalRef = ref(db, `${DB_PATHS.HOSPITALS}/${hospitalId}`);
        const snapshot = await get(hospitalRef);
        return snapshot.exists() ? snapshot.val() : null;
      } catch (error) {
        console.error('Error getting hospital data:', error);
        throw error;
      }
    }
  };