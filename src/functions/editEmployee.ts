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

export async function editEmployee(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    try {
        const body = await request.json();
        context.extraOutputs.set(sql, body);

        return {
            jsonBody: { message: `Successfully edited new Employee Record` },
        };
    } catch (e: Error | any) {
        return { jsonBody: e.message };
    }
}

app.http("editEmployee", {
    methods: ["PATCH"],
    authLevel: "anonymous",
    extraOutputs: [sql],
    handler: editEmployee,
    route: "employees/edit",
});
