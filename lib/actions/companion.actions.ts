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
    const { userId: author } = await auth();
    if (!author) throw new Error('User not authenticated');

    const supabase = createSupabaseClient();

    const { data, error } = await supabase
      .from('companions')
      .insert({ ...formData, author })
      .select();

    if (error || !data || data.length === 0) {
      throw new Error(error?.message || 'Failed to create a companion');
    }

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
  const supabase = createSupabaseClient();

  let query = supabase.from("companions").select("*");

  if (subject && topic) {
    query = query
      .ilike("subject", `%${subject}%`)
      .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  } else if (subject) {
    query = query.ilike("subject", `%${subject}%`);
  } else if (topic) {
    query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // If no companions found, return the Next.js Companion if the search matches
  if (!data || data.length === 0) {
    if (!topic || topic.toLowerCase().includes('next.js') || topic.toLowerCase().includes('nextjs')) {
      return [{
        id: "nextjs-companion",
        name: "Next.js Companion",
        topic: "Next.js Development",
        subject: "coding",
        duration: 30,
        author: "system"
      }];
    }
    return [];
  }

  return data;
};
