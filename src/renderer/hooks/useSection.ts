import { useState, useEffect, useCallback } from 'react';
import { ref, onValue } from 'firebase/database';
import { FirebaseSection } from '../../firebase/type';
import { dbService } from '../../firebase/database';
import { firebaseService } from '../../firebase';
import { DB_PATHS } from '../../firebase/type';

// hospitalId와 departmentId를 매개변수로 받음
export const useSections = (hospitalId?: string, departmentId?: string) => {
  const [sections, setSections] = useState<Record<string, FirebaseSection> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 실시간 데이터 구독
  useEffect(() => {
    // hospitalId나 departmentId가 없으면 구독하지 않음
    if (!hospitalId || !departmentId) {
      setSections(null);
      setLoading(false);
      return;
    }

    const db = firebaseService.getDatabase();
    if (!db) {
      setError(new Error('Database not initialized'));
      setLoading(false);
      return;
    }

    // 경로에 hospitalId와 departmentId 추가
    const sectionsRef = ref(db, `${DB_PATHS.SECTIONS}/${hospitalId}/${departmentId}`);
    setLoading(true);

    const unsubscribe = onValue(
      sectionsRef,
      (snapshot) => {
        const data = snapshot.val() as Record<string, FirebaseSection> | null;
        setTimeout(() => {
          setSections(data);
          setLoading(false);
        }, 0);
      },
      (error) => {
        setTimeout(() => {
          setError(error);
          setLoading(false);
        }, 0);
      }
    );

    return () => unsubscribe();
  }, [hospitalId, departmentId]);  // 의존성 배열에 hospitalId와 departmentId 추가

  // CRUD 함수들도 hospitalId와 departmentId 사용하도록 수정
  const addSection = useCallback(async (section: FirebaseSection) => {
    if (!section.hospitalId || !section.departmentId) {
      throw new Error('Hospital and department ID are required');
    }
    try {
      console.log('Adding section with:', {
        hospitalId: section.hospitalId,
        departmentId: section.departmentId,
        section
      });
      await dbService.createSection(section.hospitalId, section.departmentId, section);
      console.log('Section added successfully');
    } catch (err) {
      console.error('Error adding section:', err);
      setError(err instanceof Error ? err : new Error('Failed to create section'));
      throw err;
    }
  }, []);

  const removeSection = useCallback(async (sectionId: string) => {
    if (!hospitalId || !departmentId) {
      throw new Error('Hospital and department ID are required');
    }
    try {
      await dbService.deleteSection(hospitalId, departmentId, sectionId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete section'));
      throw err;
    }
  }, [hospitalId, departmentId]);

  const updateSection = useCallback(async (sectionId: string, updates: Partial<FirebaseSection>) => {
    if (!hospitalId || !departmentId) {
      throw new Error('Hospital and department ID are required');
    }
    try {
      await dbService.updateSection(hospitalId, departmentId, sectionId, updates);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update section'));
      throw err;
    }
  }, [hospitalId, departmentId]);

  return {
    sections,
    loading,
    error,
    addSection,
    removeSection,
    updateSection
  };
};