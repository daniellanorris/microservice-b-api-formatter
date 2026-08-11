// this will handle requests coming from the test program or main program
import { NextResponse } from "next/server";
import { format } from "../../../lib/mood/format";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
    });
}

function createSuccessResponse(formattedRequest) {
    return NextResponse.json(
        {
            result: formattedRequest
        },
        {
            status: 200,
            headers: corsHeaders,
        }
    );
}

function createErrorResponse(error) {
    return NextResponse.json(
        {
            error: "Failed to format request",
            message: error.message
        },
        {
            status: 500,
            headers: corsHeaders,
        }
    );
}

export async function POST(request) {
    try {
        const data = await request.json();

        console.log("Received formatting request:", data);

        if (
            !data.endpoint ||
            !data.method
        ) {
            return NextResponse.json(
                {
                    error: "Missing required fields"
                },
                {
                    status: 400,
                    headers: corsHeaders,
                }
            );
        }

        const formattedRequest = format(data);

        console.log("Formatted result:", formattedRequest);

        return createSuccessResponse(formattedRequest);

    } catch (error) {
        console.error("Format route error:", error);

        return createErrorResponse(error);
    }
}