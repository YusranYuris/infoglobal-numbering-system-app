import { db } from "../db/index.js"
import { users } from "../db/schema/users.js"
import { eq } from "drizzle-orm";

export const createUser = async (req, res) => {
    const { name, department, email, password } = req.body;

    const newUser = await db
        .insert(users)
        .values({
            name: name,
            department: department,
            email: email,
            password: password
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
        }

        res.status(200).json({
            success: true,
            user: user[0]
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};