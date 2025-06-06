'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'; 
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { formUrlQuery } from '@jsmastery/utils';
import { removeKeysFromUrlQuery } from '@jsmastery/utils';

const SearchInput = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams()
    const query = searchParams.get('topic') || ''

    const [searchQuery, setSearchQuery] = useState(query);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "topic",
                    value: searchQuery,
                });
                router.push(newUrl, { scroll: false });
            } else {
                if (pathname === '/companions') {
                    const newUrl = removeKeysFromUrlQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["topic"]
                    });
                    router.push(newUrl, { scroll: false });
                }
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, router, searchParams, pathname]);

    return (
        <div className='relative border border-black rounded-lg items-center flex gap-2 px-2 py-1 h-fit'>
            <Image src="/icons/search.svg" alt="search" width={15} height={15} />
            <input
                placeholder='Search Companion...'
                className='outline-none w-full'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
                <button 
                    onClick={() => setSearchQuery('')}
                    className='text-gray-500 hover:text-gray-700'
                >
                    ×
                </button>
            )}
        </div>
    );
};

export default SearchInput;
