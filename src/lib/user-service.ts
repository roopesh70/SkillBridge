import { db, auth, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, DocumentData } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { studentProfile, type Student } from './data';

export interface UserData extends Student, DocumentData {
  savedJobs: number[];
  appliedJobs: number[];
  uid: string;
}

export async function uploadProfilePhoto(userId: string, file: File): Promise<string> {
    const filePath = `avatars/${userId}/${file.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
}

export async function getUserData(userId: string): Promise<UserData | null> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) {
    return null;
  }
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data() as UserData;
  } else {
    // If the document doesn't exist, create it.
    // This can happen if a user was created via authentication but their doc wasn't written yet.
    try {
      const email = auth.currentUser.email || '';
      const newUser = await createUserDoc(userId, email);
      return newUser;
    } catch (error) {
        console.error("Error creating user document from getUserData:", error);
        return null;
    }
  }
}

export async function createUserDoc(userId: string, email: string): Promise<UserData> {
  const userDocRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data() as UserData;
  }
  
  const newUser: UserData = {
    ...studentProfile,
    name: email.split('@')[0] || 'New User', 
    uid: userId,
    savedJobs: [],
    appliedJobs: [],
  };
  await setDoc(userDocRef, newUser);
  return newUser;
}

export async function updateUserProfile(userId: string, data: Partial<UserData>) {
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
