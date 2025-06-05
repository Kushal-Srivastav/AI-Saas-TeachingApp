'use server'
import {auth} from "@clerk/nextjs/server"
import { createSupabaseClient } from "../supabase";
import { z } from "zod";

export type CreateCompanion = z.infer<typeof companionSchema>;

const companionSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  topic: z.string().min(1),
  voice: z.string().min(1),
  style: z.string().min(1),
  duration: z.number().min(1),
});

export const createCompanion = async(formData: CreateCompanion) => {
    try {
        const { userId: author } = await auth();
        if (!author) throw new Error('User not authenticated');
        
        const supabase = createSupabaseClient();

        const { data, error } = await supabase
            .from('companions')
            .insert({ ...formData, author })
             .select()

       if (error || !data) {
  throw new Error(error?.message || 'Failed to create a companion');
}


        if (!data || data.length === 0) {
            throw new Error('No data returned after companion creation');
        }

        return data[0];
    } catch (error) {
        console.error('Error in createCompanion:', error);
        throw error;
    }
}