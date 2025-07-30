import { AppError } from "../errors/app-error";
import { Infra0 } from "../types/infra";
import httpStatus from "http-status";

export const createInfra0 = (response: string): Infra0 | null => {
    try {
        const schemaMatch = response.match(/```infra0_schema\s*([\s\S]*?)\s*```/);
        
        if (!schemaMatch || !schemaMatch[1]) {
            throw new AppError("No infra0_schema section found in response", httpStatus.INTERNAL_SERVER_ERROR);
        }

        const schemaContent = schemaMatch[1].trim();
        
        const parsedSchema: Infra0 = JSON.parse(schemaContent);
        
        // Validating the structure
        if (!parsedSchema.resources || !parsedSchema.diagram) {
            throw new AppError("Invalid schema structure: missing resources or diagram", httpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!Array.isArray(parsedSchema.diagram.nodes) || !Array.isArray(parsedSchema.diagram.edges)) {
            throw new AppError("Invalid diagram structure: nodes and edges must be arrays", httpStatus.INTERNAL_SERVER_ERROR);
        }

        return parsedSchema;
    } catch (error) {
        console.error("Error parsing Infra0 schema:", error);
        return null;
    }
}