import { and, count, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { partNumbers } from "../db/schema/partNumbers.js";
import { pnRelations } from "../db/schema/pnRelations.js";
import { dnBranches } from "../db/schema/dnBranches.js";
import { documents } from "../db/schema/documents.js";

export const getAllEngineeringData = async (req, res) => {
    try {
        const allPartNumberUnit = await db
            .select({
                total: count(),
            })
            .from(pnRelations)
            .innerJoin(partNumbers, eq(pnRelations.pnCode, partNumbers.idPn))
            .where(
                and(
                    eq(pnRelations.rootId, pnRelations.pnCode),
                    eq(partNumbers.designationCode, "U")
                )
            )

        const allPartNumberModul = await db
            .select({
                total: count(),
            })
            .from(pnRelations)
            .innerJoin(partNumbers, eq(pnRelations.pnCode, partNumbers.idPn))
            .where(
                and(
                    eq(pnRelations.rootId, pnRelations.pnCode),
                    eq(partNumbers.designationCode, "M")
                )
            )
        
        const allDrawingNumber = await db
            .select({
                total: count(),
            })
            .from(dnBranches)

        const allDocNumber = await db
            .select({
                total: count()
            })
            .from(documents)

        res.status(200).json({
            success: true,
            data: {
                partNumberUnitsCount: allPartNumberUnit[0].total,
                partNumberModulesCount: allPartNumberModul[0].total,
                drawingNumbersCount: allDrawingNumber[0].total,
                documentsCount: allDocNumber[0].total
            }
        })
    } catch (error) {
        console.log("Error in getAllEngineeringData")
        res.status(500).json({
            success: false,
            messase: "Internal server error"
        })
    }
}