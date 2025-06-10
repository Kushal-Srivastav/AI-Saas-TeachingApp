import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import Cta from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import { getAllCompanions, getRecentSessions, getBookmarkedCompanions } from '@/lib/actions/companion.actions'
import { getSubjectColor } from '@/lib/utils'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const Page = async () => {
  const { userId } = await auth();
  const companions = await getAllCompanions({limit: 3})
  const recentSessionsCompanions = await getRecentSessions(10)
  const bookmarkedCompanions = userId ? await getBookmarkedCompanions(userId) : [];
  const bookmarkedIds = new Set(bookmarkedCompanions.map(c => c.id));

  return (
    <main>
      <h1>
   Popular Companions.
      </h1>
    
    <section className='home-section'>
      {companions.map((companion) =>(
               <CompanionCard
               key={companion.id}
              {...companion}
              color = {getSubjectColor(companion.subject)}
              bookmarked={bookmarkedIds.has(companion.id)}
        />
      ))}
      
    </section>

    <section className='home-section'>
      <CompanionsList
      title="Recently completed sessions."
      companions ={recentSessionsCompanions}
    classNames="w-2/3 max-lg:w-full" 
       />
      <Cta />
    </section>
    </main>
  )
}
export default Page
