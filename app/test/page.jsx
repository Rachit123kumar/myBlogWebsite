
'use client'

import { useEffect } from "react"

export default function page() {

    // curl '' --header 'Authorization: Bearer YOUR_BEARER_TOKEN'

    useEffect(() => {
        async function getTwitterTrends() {

            try{

                const res = await fetch("https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=a1d6a0f408384e24b30902b51a77efa5")
                const data = await res.json();
                console.log(data)
                return data // Top 10 trends
            } catch(err){
                console.log(err);
                console.log('error has happend')
            }


        }
        getTwitterTrends()

    }, [])





    return (
        <div>page of Testing</div>
    )
}
