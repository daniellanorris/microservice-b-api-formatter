// this will handle requests coming from the test program or main program
import { format } from "../../../lib/mood/format";

const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3001",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: corsHeaders,
    });
}

function createSuccessResponse(formattedRequest) {
    return Response.json(
        {
            result: formattedRequest
        },
        {
            status: 200,
            headers: corsHeaders
        }
    );
}

function createErrorResponse(error, status = 400) {
    return Response.json(
        {
            error: "Failed to format request",
            message: error.message
        },
        {
            status,
            headers: corsHeaders
        }
    );
}

export async function POST(request) {
    try {
        const formattingRequest = await request.json();

        console.log("Received formatting request:", formattingRequest);

        if (
            !formattingRequest.endpoint ||
            !formattingRequest.method
        ) {
            return Response.json(
                {
                    error: "Missing required fields"
                },
                {
                    status: 400,
                    headers: corsHeaders
                }
            );
        }

        const formattedRequest = format(formattingRequest);

        console.log("Formatted result:", formattedRequest);

        return createSuccessResponse(formattedRequest);

    } catch (error) {
        console.error("Format route error:", error);

        return createErrorResponse(error);
    }
}