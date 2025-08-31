import { CreateUserPayload, InsertUserPayload, LoginPayload } from "../dto/User.model";
import { FirebaseCollection } from "../enums/FirebaseCollection.enum";
import { GetFirebaseDataPayload, WhereDataType } from "../type/firebaseType.type";
import { addCollection, getData } from "../utils/firebase.utils";

export async function createUser(createUser:CreateUserPayload) {
    try {
        const payload:InsertUserPayload = {
            ...createUser,
            firstname: createUser.firstname.toLocaleUpperCase(),
            lastname: createUser.lastname.toLocaleUpperCase(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        const response = await addCollection(FirebaseCollection.USER, payload)

        return {
            ...payload,
            id:response.id
        }
    } catch (error) {
        throw new Error("Something went wrong while creating user: " + error)
    }
}

export async function login(loginPayload:LoginPayload) {
    const whereData: WhereDataType[] = [['email', '==', loginPayload.email], ['password', '==', loginPayload.password]];

    const qryPayload: GetFirebaseDataPayload = {
        firebaseCollection: FirebaseCollection.USER,
        filter:whereData
    }

    const data = await getData(qryPayload)

    return data[0];
}