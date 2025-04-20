import { WhereFilterOp } from "firebase/firestore";
import { FirebaseCollection, FirebaseOrderDirection } from "../enums/FirebaseCollection.enum";

export type WhereDataType = [string,WhereFilterOp,any] 


export type GetFirebaseDataPayload = {
    firebaseCollection:FirebaseCollection,
    filter:Array<WhereDataType>,
    sort?:FirebaseOrderDirection
    sortKey?:string;
}

export type GetFirebaseDataResponse<T> = {
    id: string;
    data: T;
}