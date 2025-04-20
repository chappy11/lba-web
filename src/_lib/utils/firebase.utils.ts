import { addDoc, collection, DocumentData, getDocs, orderBy, OrderByDirection, query, QueryDocumentSnapshot, where, WhereFilterOp } from "firebase/firestore";
import { FirebaseCollection, FirebaseOrderDirection } from "../enums/FirebaseCollection.enum";
import db from "../config/firebaseConfig";
import { GetFirebaseDataPayload, GetFirebaseDataResponse, WhereDataType } from "../type/firebaseType.type";



export const getData = async<T>(payload:GetFirebaseDataPayload) =>{
    try {
        const {firebaseCollection, filter} = payload;
        let qry = query(collection(db, firebaseCollection as string));
        // Add dynamic where clauses if there are any conditions
        filter.forEach(([field,condition,value]) => {
            qry = query(qry, where(field, condition, value));
        });
        // Add ordering if a field is specified
        if (payload.sortKey) {
          qry = query(qry, orderBy(payload.sortKey, payload.sort as OrderByDirection));
        }
    
        // Add limit if specified
    
        // Execute the query
        const snapShot = await getDocs(qry);
    
        // Extract and return the data from snapshot
        const data = snapShot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data()
        }));
    
        return data;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return [];
      }

}


export const addCollection = async<FirebaseCollection,T>(dbCollection: FirebaseCollection,payload:T) =>{
    const colRef = collection(db, dbCollection as string);
    const docRef = await addDoc(colRef, payload as DocumentData);

    return docRef;
}