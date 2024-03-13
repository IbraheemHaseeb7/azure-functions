import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
    output,
} from "@azure/functions";

const sql = output.sql({
    commandText: "Employees",
    connectionStringSetting: "SqlConnectionString",
});

export async function addEmployee(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    try {
        const body = await request.json();
        context.extraOutputs.set(sql, body);

        return {
            jsonBody: { message: `Successfully added new Employee Record` },
        };
    } catch (e: Error | any) {
        return { jsonBody: e.message };
    }
}

app.http("addEmployee", {
    methods: ["POST", "PUT"],
    authLevel: "anonymous",
    extraOutputs: [sql],
    handler: addEmployee,
});
