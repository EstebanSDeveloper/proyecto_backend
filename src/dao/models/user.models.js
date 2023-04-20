import mongoose from "mongoose";

const userCollection = "users";

const usersSchema = new mongoose.Schema({
	name: String,
	age: Number,
	email: String,
	password: String,
	role: { type: String, enum: ["user", "admin"], default: "user" },
});

export const UserModel = mongoose.model(userCollection, usersSchema);
