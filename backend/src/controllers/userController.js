import { db } from "../db/index.js";
import { users } from "../db/schema/users.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
    const { name, department, email, password, role } = req.body;

    const newUser = await db
        .insert(users)
        .values({
            name: name,
            department: department,
            email: email,
            password: password,
            role: role
        }).returning();
    
    res.status(201).json({
        success: true,
        data: newUser[0]
    });
}

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user[0].password !== password) {
            return res.status(401).json({
                success: false,
                message: "Wrong password"
            });
        };

        const foundUser = user[0];

        const token = jwt.sign(
            {
                idUser: foundUser.idUser,
                name: foundUser.name,
                department: foundUser.department,
                role: foundUser.role,
                email: foundUser.email,
            },
            process.env.JWT_SECRET_KEY,
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                idUser: foundUser.idUser,
                name: foundUser.name,
                department: foundUser.department,
                role: foundUser.role,
                email: foundUser.email,
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};