'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'

export default function ChatWithNoId() {
    const router = useRouter();
    useEffect(() => {
        const id = uuidv4();
        router.push(`/chat/${id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
}
