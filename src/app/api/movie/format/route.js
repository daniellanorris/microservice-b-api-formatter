import { NextResponse } from "next/server";
import { format } from "../../../lib/movie/format";

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

export async function POST(request) {
    try {

        const data = await request.json();

        console.log("Received formatting request:", data);

        const result = await format(data);

        console.log("Formatted result:", result);

        return NextResponse.json(
            {
                result: result
            },
            {
                status: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );

    } catch (error) {

        console.error("Format route error:", error);

        return NextResponse.json(
            {
                error: "Failed to format request",
                message: error.message
            },
            {
                status: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            }
        );
    }
}