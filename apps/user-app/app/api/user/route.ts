import { NextResponse } from "next/server";
import { PrismaClient} from "@repo/db"


const client = new PrismaClient();

export const GET = async()=>{

    await client.user.create({

        data: {

            email:"asd",
            name: "asfasdf"
        }
    })

    return NextResponse.json({

        message: "hi there"
    })
}