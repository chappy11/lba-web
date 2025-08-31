export enum UserRole {
  ADMIN = "admin",
  User = "user",
}

export type UserModel = {
  id: string
  firstname: string
  lastname: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export type CreateUserPayload = Omit<
  UserModel,
  "id" | "createdAt" | "updatedAt"
>
export type InsertUserPayload = Omit<UserModel, "id">

export type LoginPayload = Pick<UserModel, "email" | "password">

export type UserResponse = Omit<UserModel, "password">
