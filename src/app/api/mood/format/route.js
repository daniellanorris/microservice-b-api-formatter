// this will handle requests coming from the test program or main program

import {formatMoodRequest} from "../../../lib/mood/format";

export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.mood_name || !data.note) {
            return Response.json(
                {
                    error: "Missing mood name or note."
                },
                {
                    status: 400
                }
            );
        }

        return Response.json(
            formatMoodRequest(data)
        );
    }
    catch (error) {
        return Response.json (
            {
                error: "Invalid request."
            },
            {
                status: 400
            }
        );
    }
}