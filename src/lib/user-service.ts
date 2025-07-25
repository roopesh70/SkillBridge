import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, DocumentData } from 'firebase/firestore';

export interface UserData extends DocumentData {
  savedJobs: number[];
  appliedJobs: number[];
}

export async function getUserData(userId: string): Promise<UserData | null> {
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data() as UserData;
  }
  return null;
}

export async function createUserDoc(userId: string) {
  const userDocRef = doc(db, 'users', userId);
  await setDoc(userDocRef, {
    savedJobs: [],
    appliedJobs: [],
  });
}

export async function saveJob(userId: string, jobId: number) {
  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, {
    savedJobs: arrayUnion(jobId)
  });
}

export async function unsaveJob(userId: string, jobId: number) {
  const userDocRef = doc(db, 'users', userId);
  await updateDoc(userDocRef, {
    savedJobs: arrayRemove(jobId)
  });
}

export async function applyForJob(userId: string, jobId: number) {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, {
        appliedJobs: arrayUnion(jobId)
    });
}
