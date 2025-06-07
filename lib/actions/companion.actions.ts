'use server'
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { z } from "zod";
import { Filter } from "lucide-react";

export type CreateCompanion = z.infer<typeof companionSchema>;

const companionSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  topic: z.string().min(1),
  voice: z.string().min(1),
  style: z.string().min(1),
  duration: z.number().min(1),
});

export const createCompanion = async (formData: CreateCompanion) => {
  try {
    console.log('Creating companion with data:', formData);
    const { userId: author } = await auth();
    if (!author) {
      console.error('User not authenticated');
      throw new Error('User not authenticated');
    }
    console.log('User authenticated:', author);

    const supabase = createSupabaseClient();
    console.log('Supabase client created');

    const { data, error } = await supabase
      .from('companions')
      .insert({ ...formData, author })
      .select();

    console.log('Insert result:', { data, error });

    if (error || !data || data.length === 0) {
      console.error('Error creating companion:', error);
      throw new Error(error?.message || 'Failed to create a companion');
    }

    console.log('Companion created successfully:', data[0]);
    return data[0];
  } catch (error) {
    console.error('Error in createCompanion:', error);
    throw error;
  }
};

export const getAllCompanions = async ({
  limit = 10,
  page = 1,
  subject,
  topic
}: GetAllCompanions) => {
  console.log('Search params:', { subject, topic });
  const supabase = createSupabaseClient();

  // Check if this is a Next.js search
  const isNextJsSearch = typeof topic === "string" && 
    (topic.toLowerCase().includes("next.js") || topic.toLowerCase().includes("nextjs"));

  let query = supabase.from("companions").select("*");

  // Build the search query with more flexible matching
  if (subject && topic && typeof topic === "string") {
    // Split topic into words for more flexible matching
    const topicWords = topic.toLowerCase().split(' ').filter((word: string) => word.length > 0);
    console.log('Searching with topic words:', topicWords);
    
    // First filter by subject
    query = query.ilike("subject", `%${subject}%`);
    
    // Then add topic conditions
    const topicConditions = topicWords.map((word: string) => 
      `topic.ilike.%${word}%,name.ilike.%${word}%`
    ).join(',');
    
    query = query.or(topicConditions);
    console.log('Searching with both subject and topic using flexible matching');
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
    console.log('Searching with subject only:', subject);
  } else if (topic && typeof topic === "string") {
    // Split topic into words for more flexible matching
    const topicWords = topic.toLowerCase().split(' ').filter((word: string) => word.length > 0);
    console.log('Searching with topic words:', topicWords);
    
    const topicConditions = topicWords.map((word: string) => 
      `topic.ilike.%${word}%,name.ilike.%${word}%`
    ).join(',');
    
    query = query.or(topicConditions);
    console.log('Searching with topic only using flexible matching');
  } else {
    // If no search parameters, return all companions
    console.log('No search parameters, returning all companions');
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  console.log('Executing query...');
  const { data, error } = await query;
  console.log('Query result:', { data, error });

  if (error) {
    console.error('Supabase query error:', error);
    throw new Error(error.message);
  }

  // If this is a Next.js search, include the Next.js companion in the results
  if (isNextJsSearch) {
    const nextJsCompanion = {
      id: "nextjs-companion",
      name: "Next.js Companion",
      topic: "Next.js Development",
      subject: "coding",
      duration: 30,
      author: "system"
    };
    
    // If we have other results, combine them with the Next.js companion
    if (data && data.length > 0) {
      return [nextJsCompanion, ...data];
    }
    
    // If no other results, just return the Next.js companion
    return [nextJsCompanion];
  }

  return data || [];
};

export const getCompanion = async (id: string) => {
  if (id === "nextjs-companion") {
    return {
      id: "nextjs-companion",
      name: "Next.js Companion",
      topic: "Next.js Development",
      subject: "coding",
      duration: 30,
      author: "system",
    };
  }

  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from('companions')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error("getCompanion error:", error?.message);
    return null;
  }

  return data;
};

