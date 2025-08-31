import { axiosConfig } from "../config/config";
import { CreateUserPayload } from "../dto/User.model";

export async function createUser(createUserPayload:CreateUserPayload) {
    const resp = await axiosConfig.post('/user', createUserPayload);
    return resp.data;
}

export async function login(email:string, password:string) {
    const resp = await axiosConfig.get('/user', {
        params: {
            email,
            password
        }
    });
    return resp.data;
}
