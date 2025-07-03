
'use client'

import axios from "axios";
import { useEffect } from "react"

export default function page() {

    // curl '' --header 'Authorization: Bearer YOUR_BEARER_TOKEN'

    async function getTwitterTrends() {

        try {

            const res = await fetch("https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=a1d6a0f408384e24b30902b51a77efa5")
            const data = await res.json();
            console.log(data)
            const res2 = await axios.post('/api/save-news', data)
            console.log(res2.data)
            return data // Top 10 trends
        } catch (err) {
            console.log(err);
            console.log('error has happend')
        }


    }


    async function generatingByAI(){
        const res=await axios.post('/api/descriptiontoblog')
        console.log(res.data)
    }


    async function newsDataio(){
        const data=await fetch('/api/save-news')
        const res=await data.json();
        return res
    }

    useEffect(() => {



        
        // generatingByAI()
        // getTwitterTrends()
        console.log(newsDataio())


      

    }, [])





    return (
        <div>page of Testing</div>
    )
}
