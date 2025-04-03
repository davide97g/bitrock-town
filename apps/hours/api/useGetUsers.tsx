'use client'
import { supabase } from "@/app/(config)/supabase";
import { IUser } from "@bitrock/types";
import { useEffect, useState } from "react";

export const useGetUsers = ()=>{
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        setLoading(true);
        supabase.auth.getSession().then(async (session)=>{
        try {
                try {
                    const res = await fetch("http://localhost:3000/users", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${session.data.session?.access_token}`,
                        },
                    });
                    const data = await res.json();
                    return setUsers(data as IUser[]);
                } finally {
                    return setLoading(false);
                }
            } catch (err) {
                return console.log(err);
            }
        })
    }
    ,[]);
    
    return {users, loading};
    
}