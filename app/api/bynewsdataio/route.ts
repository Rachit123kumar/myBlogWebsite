import { NextResponse } from "next/server"

export async function GET() {


    try {
        const data = await fetch(`https://api.mediastack.com/v1/news?access_key=837cc33aed82cf0429bd669d8e4532a6&keywords=tennis&countries=ca,gb,de`);

        const res = await data.json()
        return NextResponse.json(res)

    } catch (err) {
        console.log(err)
        return NextResponse.json({
            status: 404,
            error: "error "
        }

        )
    }


}