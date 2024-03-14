import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
    input,
} from "@azure/functions";

const sql = input.sql({
    commandText: "SELECT * FROM Employees where employee_id=@Id",
    commandType: "Text",
    connectionStringSetting: "SqlConnectionString",
    parameters: "@Id={Query.id}",
});

export async function getOneEmployee(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    try {
        const results = context.extraInputs.get(sql);

        return { jsonBody: results };
    } catch (e: Error | any) {
        return { status: 500 };
    }
}

app.http("getOneEmployee", {
    methods: ["GET"],
    authLevel: "anonymous",
    handler: getOneEmployee,
    extraInputs: [sql],
    route: `employees/one`,
});
