import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
    input,
    output,
} from "@azure/functions";

// fetches all employees
const inputGetAllEmployees = input.sql({
    commandText: "SELECT * FROM dbo.Employees",
    commandType: "Text",
    connectionStringSetting: "SqlConnectionString",
});

// get one employee with ID
const inputGetEmployee = input.sql({
    commandText: "SELECT * FROM dbo.Employees where [employee_id]=@Id",
    commandType: "Text",
    connectionStringSetting: "SqlConnectionString",
    parameters: "@Id={Query.id}",
});

// inserts one employee
const outputInsertEmployee = output.sql({
    commandText: "Employees",
    connectionStringSetting: "SqlConnectionString",
});

// update one employee
const outputUpdateEmployee = output.sql({
    commandText: "Employees",
    connectionStringSetting: "SqlConnectionString",
});

// delete one employee record
const inputDeleteEmployee = input.sql({
    commandText: "DELETE FROM Employees where [employee_id]=@Id",
    commandType: "Text",
    connectionStringSetting: "SqlConnectionString",
    parameters: "@Id={Query.id}",
});

export async function employees(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    try {
        switch (request.method) {
            case "GET":
                if (request.query.get("id")) {
                    const singleEmployee =
                        context.extraInputs.get(inputGetEmployee);
                    return { jsonBody: singleEmployee };
                } else {
                    const allEmlpoyees =
                        context.extraInputs.get(inputGetAllEmployees);
                    return { jsonBody: allEmlpoyees };
                }
            case "POST":
                const insertData = await request.json();
                context.extraOutputs.set(outputInsertEmployee, insertData);
                return {
                    jsonBody: {
                        message: "Successfully added new Employee Record",
                    },
                };
            case "PATCH":
                const updateData = await request.json();
                context.extraOutputs.set(outputUpdateEmployee, updateData);
                return {
                    jsonBody: {
                        message: "Successfully edited Employee Record",
                    },
                };
            case "DELETE":
                context.extraInputs.get(inputDeleteEmployee);
                return {
                    jsonBody: {
                        message: "Successfully deleted Employee Record",
                    },
                };

            default:
                return { status: 404 };
        }
    } catch (e: Error | any) {
        return { status: 500, jsonBody: { message: e.message } };
    }
}

app.http("employees", {
    methods: ["GET", "POST", "PATCH", "DELETE"],
    authLevel: "anonymous",
    handler: employees,
    extraInputs: [inputGetAllEmployees, inputDeleteEmployee, inputGetEmployee],
    // extraOutputs: [outputInsertEmployee, outputUpdateEmployee],
    route: "employees",
});
