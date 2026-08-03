import {format} from "../../../lib/mood/format";


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


export async function POST(request){

    try{

        const data = await request.json();


        if(
            !data.endpoint ||
            !data.method
        ){

            return Response.json(
                {
                    error:"Missing required fields"
                },
                {
                    status:400,
                    headers:corsHeaders
                }
            );

        }


        const result = format(data);


        return Response.json(
            {
                result
            },
            {
                headers:corsHeaders
            }
        );


    }

    catch(error){

        return Response.json(
            {
                error:"Failed to format request",
                message:error.message
            },
            {
                status:400,
                headers:corsHeaders
            }
        );

    }

}