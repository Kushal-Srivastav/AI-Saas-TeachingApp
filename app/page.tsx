import CompanionCard from '@/components/CompanionCard'
import CompanionsList from '@/components/CompanionsList'
import Cta from '@/components/CTA'
import { Button } from '@/components/ui/button'
import React from 'react'

const Page = () => {
  return (
    <main>
      <h1>
   Popular Companions.
      </h1>
    
    <section className='home-section'>
       <CompanionCard
         id="123"
         name="Neura The Brainy Explorer."
         topic="Neural network of the brain."
         subject="science"
         duration={45}
         color="#ffda6e"
        />
       <CompanionCard
        id="456"
         name="Countsy the number wizard."
         topic="Derivatives and Integrals."
         subject="Maths."
         duration={30}
         color="#e5d0ff"
        />
      <CompanionCard
       id="789"
         name="Verba the vocabualry builder."
         topic="Language."
         subject="English Literature."
         duration={30}
         color="#BDE7FF"
       />
    </section>

    <section className='home-section'>
      <CompanionsList />
      <Cta />
    </section>
    </main>
  )
}
export default Page
