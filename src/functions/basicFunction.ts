import {
    app,
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
} from "@azure/functions";

export async function basicFunction(
    request: HttpRequest,
    context: InvocationContext
): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const router = request.params;

    console.log(router);

    const name = request.query.get("name") || (await request.text()) || "chomu";

    return { body: `Hello, ${name}!` };
}

app.http("basicFunction", {
    methods: ["GET", "POST"],
    authLevel: "anonymous",
    handler: basicFunction,
});
