import { format } from "morgan";
import { db } from "../db/index.js";
import { dnBranches } from "../db/schema/dnBranches.js";
import { asc, eq } from "drizzle-orm";

export const getAllBranch = async (req, res) => {
    try {
        const allBranch = await db
            .select()
            .from(dnBranches)
            .orderBy(
                asc(dnBranches.rootId),
                asc(dnBranches.group),
                asc(dnBranches.subGroup),
                asc(dnBranches.subSg)
            );
        
        res.status(200).json({
            success: true,
            data: allBranch,
        });

    } catch (error) {
        console.log("Error in getAllBranch function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

export const getBranch = async (req, res) => {
    const { id } = req.params;

    try {
        const branch = await db
            .select()
            .from(dnBranches)
            .where(eq(dnBranches.idBranch, id));
        
        res.status(200).json({
            success: true,
            data: branch
        });

    } catch (error) {
        console.log("Error in getBranch function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createBranch = async (req, res) => {
    let {
        rootId,
        group,
        subGroup,
        subSg,
        description,
        createdBy
    } = req.body;  //Nanti yang createdBy diedit kalau udah pake JWT

    if (!rootId || group===null || !description || !createdBy)
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });

    const numSubGroup = subGroup ? Number(subGroup) : 0;
    const numSubSg = subSg ? Number(subSg) : 0;

    const formattedGroup = String(group).padStart(2, "0");

    let formattedGroupSubGroupSubSG = ""

    if (numSubSg === 0) {
        if (numSubGroup === 0) {
            formattedGroupSubGroupSubSG = `${formattedGroup}-000`;
        } else {
            formattedGroupSubGroupSubSG = `${formattedGroup}-${String(numSubGroup).padStart(3, "0")}`;
        };
    } else {
        formattedGroupSubGroupSubSG = `${formattedGroup}-${numSubGroup + String(numSubSg).padStart(2, "0")}`;
    };
    
    const formattedBranch = String(`${rootId}-${formattedGroupSubGroupSubSG}`);

    try {
        console.log("Nilai sub sg = " + numSubSg)
        const newBranch = await db
            .insert(dnBranches)
            .values({
                idBranch: formattedBranch,
                rootId: rootId,
                group: group,
                subGroup: numSubGroup,
                subSg: numSubSg,
                description: description,
                createdBy: createdBy
            }).returning();
        res.status(201).json({
            success: true,
            data: newBranch[0],
        });

    } catch (error) {
        console.log("Error in createBranch function", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    };
};