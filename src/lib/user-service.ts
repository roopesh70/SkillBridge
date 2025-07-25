import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, DocumentData } from 'firebase/firestore';
import { studentProfile, type Student } from './data';

export interface UserData extends Student, DocumentData {
  savedJobs: number[];
  appliedJobs: number[];
  uid: string;
}

export async function getUserData(userId: string): Promise<UserData | null> {
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    return userDoc.data() as UserData;
  }
  return null;
}

export async function createUserDoc(userId: string, email: string) {
  const userDocRef = doc(db, 'users', userId);
  const newUser: UserData = {
    ...studentProfile,
    // You might want to use the email as a default name or leave it
    name: email.split('@')[0], 
    uid: userId,
    savedJobs: [],
    appliedJobs: [],
  };
  await setDoc(userDocRef, newUser);
}

export async function updateUserProfile(userId: string, data: Partial<Student>) {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, data);
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