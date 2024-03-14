import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
    input,
} from "@azure/functions";

const sql = input.sql({
    commandText: "DELETE FROM Employees where [employee_id]=@Id",
    commandType: "Text",
    connectionStringSetting: "SqlConnectionString",
    parameters: "@Id={Query.id}",
});

export async function deleteEmployee(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    try {
        context.extraInputs.get(sql);
        return {
            jsonBody: { message: `Successfully deleted Employee Record` },
        };
    } catch (e: Error | any) {
        return { jsonBody: e.message };
    }
}

app.http("deleteEmployee", {
    methods: ["DELETE"],
    authLevel: "anonymous",
    extraInputs: [sql],
    handler: deleteEmployee,
    route: "employees",
});
