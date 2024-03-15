import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
    input,
} from "@azure/functions";

const sqlall = input.sql({
    commandText: "SELECT * FROM dbo.Employees",
    commandType: "Text",
    connectionStringSetting: "SqlConnectionString",
});

export async function getAllEmployees(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    try {
        const result = context.extraInputs.get(sqlall);
        return { status: 200, jsonBody: { data: result } };
    } catch (e: Error | any) {
        return { status: 200, jsonBody: { message: e.message } };
    }
}

app.http("getAllEmployees", {
    methods: ["GET"],
    authLevel: "anonymous",
    extraInputs: [sqlall],
    handler: getAllEmployees,
    route: "employees/all",
});
