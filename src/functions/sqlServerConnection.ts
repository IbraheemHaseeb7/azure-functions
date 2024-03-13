import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
} from "@azure/functions";
import { connect } from "mssql";

export async function sqlServerConnection(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    try {
        const connection = await connect({
            database: process.env["Database"],
            user: process.env["User"],
            password: process.env["Password"],
            server: process.env["Server"],
            options: {
                encrypt: true,
                trustServerCertificate: false,
            },
        });

        const result = await connection.query`SELECT * FROM Employees`;

        return { status: 200, jsonBody: { data: result.recordset } };
    } catch (e: Error | any) {
        return { status: 500, jsonBody: { message: e.message } };
    }
}

app.http("sqlServerConnection", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    handler: sqlServerConnection,
});
