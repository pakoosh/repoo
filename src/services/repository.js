import { db } from './firebase';
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, setDoc, orderBy, GeoPoint, Timestamp  } from 'firebase/firestore';

// Assume you're using Firebase Authentication to get the current user's UID
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";

const auth = getAuth();


const sendUserEmailVerification = async (user) => {
    try {
        console.log('---');
        await sendEmailVerification(auth.currentUser);
        console.log(`Verification email sent to ${userRecord.email}`);
        return { message: "email sended.." }

    } catch (error) {
        console.error('Error send Email Verification: ', error);
        throw new Error('Error send Email Verificatio');
    }
};
// Function to get the current user's ID
const getCurrentUserId = () => {
    const user = auth.currentUser;
    return user ? user.uid : null; // Return user ID if logged in, otherwise null
};

// Function to get Reference
const getGeoLocation = (latitude = 0, longitude = 0) => {
    return new GeoPoint(latitude, longitude);
};

// Function to get Reference
const getTimestamp = (timestamp) => {
    return Timestamp.fromDate(timestamp);
};

// Function to get Reference
const getRef = (entity, condition) => {
    return doc(db, entity, condition);
};

// Function to set
const set = (ref, data) => {
    try {
        setDoc(ref, data);
        return true;
    } catch (error) {
        console.error('Error setting documents: ', error);
        throw new Error('Error setting data');
    }
};

// Get all data from a collection 
const getComplete = async (entity) => {
    try {
        const querySnapshot = await getDocs(collection(db, entity));
        const data = [];
        querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
        });
        return data;
    } catch (error) {
        console.error('Error getting documents: ', error);
        throw new Error('Error fetching data');
    }
};

// Get all data not soft deleted from a collection 
const getAll = async (entity) => {
    try {
        const querySnapshot = await getDocs(collection(db, entity), where("is_deleted", "==", false));
        const data = [];
        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            data.push({ id: doc.id, ...docData, created_at: docData.created_at?.toDate().toISOString(), updated_at: docData.updated_at?.toDate().toISOString(), deleted_at: docData.deleted_at?.toDate().toISOString() });
        });
        return data;
    } catch (error) {
        console.error('Error getting documents: ', error);
        throw new Error('Error fetching data');
    }
};

const getAllSelf = async (entity) => {
    try {
        const userId = getCurrentUserId();

        const q = query(
            collection(db, entity),
            where("is_deleted", "==", false),
            where("created_by", "==", userId)
        );

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => {
            const docData = doc.data();
            return {
                id: doc.id,
                ...docData,
                created_at: docData.created_at?.toDate().toISOString(),
                updated_at: docData.updated_at?.toDate().toISOString(),
                deleted_at: docData.deleted_at?.toDate().toISOString()
            };
        });

        return data;
    } catch (error) {
        console.error('Error getting documents: ', error);
        throw new Error('Error fetching data');
    }
};

const getAllActive = async (entity) => {
    try {
        const querySnapshot = await getDocs(collection(db, entity), where("active", "==", true), where("is_deleted", "==", false));
        const data = [];
        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            data.push({ id: doc.id, ...docData, created_at: docData.created_at?.toDate().toISOString(), updated_at: docData.updated_at?.toDate().toISOString(), deleted_at: docData.deleted_at?.toDate().toISOString() });
        });
        return data;
    } catch (error) {
        console.error('Error getting documents: ', error);
        throw new Error('Error fetching data');
    }
};

const getAllActiveSelf = async (entity) => {
    try {
        const userId = getCurrentUserId();
        const querySnapshot = await getDocs(collection(db, entity), where("active", "==", true), where("is_deleted", "==", false), where("created_by", "==", userId));
        const data = [];
        querySnapshot.forEach((doc) => {
            const docData = doc.data();
            data.push({ id: doc.id, ...docData, created_at: docData.created_at?.toDate().toISOString(), updated_at: docData.updated_at?.toDate().toISOString(), deleted_at: docData.deleted_at?.toDate().toISOString() });
        });
        return data;
    } catch (error) {
        console.error('Error getting documents: ', error);
        throw new Error('Error fetching data');
    }
};

// Get a single document based on an ID
const get = async (entity, id) => {
    try {
        const docRef = doc(db, entity, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const docData = docSnap.data();
            return {
                id: docSnap.id,
                ...docData,
                created_at: docData.created_at?.toDate()?.toISOString(),
                updated_at: docData.updated_at?.toDate().toISOString(),
                deleted_at: docData.deleted_at?.toDate().toISOString()
            }
        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting document: ', error);
        throw new Error('Error fetching document');
    }
};

//get by conditions

const getByConditions = async (entity, conditions = []) => {
    try {
        const baseRef = collection(db, entity);

        // Build query with all conditions
        const queryConditions = conditions.map(({ field, operator, value }) =>
            where(field, operator, value)
        );

        const queryRef = query(baseRef, ...queryConditions);
        const querySnapshot = await getDocs(queryRef);

        const data = querySnapshot.docs.map((doc) => {
            const docData = doc.data();

            return {
                id: doc.id,
                ...docData,
                created_at: docData.created_at?.toDate?.().toISOString() ?? null,
                updated_at: docData.updated_at?.toDate?.().toISOString() ?? null,
                deleted_at: docData.deleted_at?.toDate?.().toISOString() ?? null,
            };
        });

        return data;
    } catch (error) {
        console.error('Error getting documents by conditions: ', error);
        throw new Error('Error fetching data by conditions');
    }
};

//get by condition
const getByCondition = async (entity, field, operator, value) => {
    try {
        const userId = getCurrentUserId();
        const collectionRef = collection(db, entity);

        // Create a query with multiple conditions
        const queryRef = query(
            collectionRef,
            where(field, operator, value),
            where("is_deleted", "==", false),
            where("created_by", "==", userId)
        );

        const querySnapshot = await getDocs(queryRef);
        // console.log("querySnapshot", querySnapshot);
        // console.log(field, operator, value);
        const data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            // companyRef: doc.data().companyRef?.id || null,
            created_at: doc.data().created_at?.toDate().toISOString(),
            updated_at: doc.data().updated_at?.toDate().toISOString(),
            deleted_at: doc.data().deleted_at?.toDate().toISOString()
        }));

        // console.log("data", data);

        return data;
    } catch (error) {
        console.error('Error getting documents by conditions: ', error);
        throw new Error('Error fetching data by conditions');
    }
};

// Add data to a collection
const add = async (entity, data) => {
    try {
        const userId = getCurrentUserId();
        const docRef = await addDoc(collection(db, entity), {
            ...data,
            is_deleted: false,
            active: true,
            // created_by: userId,
            // created_at: new Date(),
        });
        console.log('Document written with ID: ', docRef.id);
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error('Error adding document: ', error);
        throw new Error('Error adding document');
    }
};

// Add data to a collection 
const createNewUser = async (entity, data) => {
    try {
        const userId = getCurrentUserId();
        const { email, ...otherData } = data;

        const userCredential = await createUserWithEmailAndPassword(auth, email, "P@ssw0rd");
        const user = userCredential.user;

        await sendEmailVerification(user);
        console.log("Email verification sent to:", user.email);

        const docRef = await addDoc(collection(db, entity), {
            ...otherData,
            email: user.email,
            uid: user.uid,
            // is_deleted: false,
            active: true,
            // created_by: userId,
            // created_at: new Date(),
        });

        // await setDoc(doc(db, "users", user.uid), docRef);
        // console.log('Document written with ID: ', docRef.id);

        return { id: docRef.id, ...data };
    } catch (error) {
        console.error('Error adding document: ', error);
        throw new Error('Error adding document');
    }
};

// Update data based on a condition (e.g., document ID)
const update = async (entity, condition, data) => {
    try {
        const userId = getCurrentUserId();
        const docRef = doc(db, entity, condition);
        await updateDoc(docRef, {
            ...data,
            // is_updated: true,
            // updated_by: userId,
            // updated_at: new Date(),
        });
        const updatedDoc = await getDoc(docRef);

        // console.log('Document updated with ID: ', condition);
        if (updatedDoc.exists()) {
            return { id: updatedDoc.id, ...updatedDoc.data() };
        } else {
            throw new Error('Updated document not found');
        }
    } catch (error) {
        console.error('Error updating document: ', error);
        throw new Error('Error updating document');
    }
};

// Soft delete data (mark document as deleted without removing it)
const softDelete = async (entity, id) => {
    try {
        console.log("called...")
        // const userId = getCurrentUserId();
        const docRef = doc(db, entity, id);
        console.log("docRef... ",docRef)
        await updateDoc(docRef, {
            is_deleted: true,
            // deleted_by: userId, // Track who soft deleted the document
            deleted_at: new Date(), // Optionally add a timestamp
        });
        console.log('Document marked as deleted with ID: ', id);
    } catch (error) {
        console.error('Error soft deleting document: ', error);
        throw new Error('Error soft deleting document');
    }
};

// Hard delete data (completely delete the document)
const hardDelete = async (entity, id) => {
    try {
        const userId = getCurrentUserId();
        const docRef = doc(db, entity, id);
        await deleteDoc(docRef);
        console.log('Document deleted with ID: ', id);
    } catch (error) {
        console.error('Error hard deleting document: ', error);
        throw new Error('Error hard deleting document');
    }
};

export { sendUserEmailVerification, getByCondition, getByConditions, getCurrentUserId, getRef, getComplete, getAll, getAllSelf, getAllActive, getAllActiveSelf, get, set, add, update, softDelete, hardDelete, createNewUser, getGeoLocation,getTimestamp };
