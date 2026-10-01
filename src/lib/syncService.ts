import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  StudentProfile, 
  Chapter, 
  StudySession, 
  QuizAttempt, 
  VirtualPlant, 
  ToDoItem, 
  QuizQuestion 
} from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): FirestoreErrorInfo {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

export interface StudentTrackerData {
  profile?: StudentProfile;
  chapters?: Chapter[];
  toDos?: ToDoItem[];
  studySessions?: StudySession[];
  quizAttempts?: QuizAttempt[];
  virtualPlants?: VirtualPlant[];
  quizQuestions?: QuizQuestion[];
  updatedAt?: any;
}

/**
 * Loads student tracker data from Firestore collection `users/${userId}/trackerData/main`
 */
export async function loadStudentTrackerData(userId: string): Promise<StudentTrackerData | null> {
  const docPath = `users/${userId}/trackerData/main`;
  try {
    const docRef = doc(db, 'users', userId, 'trackerData', 'main');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as StudentTrackerData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
    return null;
  }
}

/**
 * Saves student study tasks and progress to Firestore collection `users/${userId}/trackerData/main`
 */
export async function saveStudentTrackerData(userId: string, data: StudentTrackerData): Promise<boolean> {
  const docPath = `users/${userId}/trackerData/main`;
  try {
    const docRef = doc(db, 'users', userId, 'trackerData', 'main');
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
    return false;
  }
}
