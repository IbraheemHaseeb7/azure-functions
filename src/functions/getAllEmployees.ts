import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
    input,
} from "@azure/functions";

const sql = input.sql({
    commandText: "SELECT * FROM dbo.Employees",
    commandType: "Text",
    connectionStringSetting: "SqlConnectionString",
});

export async function getAllEmployees(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    try {
        const result = context.extraInputs.get(sql);

        return { status: 200, jsonBody: { data: result } };
    } catch (e: Error | any) {
        return { status: 500, jsonBody: { message: e.message } };
    }
}

app.http("getAllEmployees", {
    methods: ["GET"],
    authLevel: "anonymous",
    extraInputs: [sql],
    handler: getAllEmployees,
    route: "employees",
});
