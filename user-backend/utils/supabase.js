import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

// Server-side client
export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Get public URL for a path
export function getPublicUrl(bucket, path) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || '';
}

// Upload a buffer and return { path, publicUrl }
export async function uploadBufferToSupabase({ bucket, folder, filename, buffer, contentType }) {
  const safeName = filename.replace(/\s+/g, '_').toLowerCase();
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const path = `${folder}/${unique}-${safeName}`;

  const { error } = await supabase.storage.from(bucket).upload(path, buffer, {
    contentType: contentType || 'application/octet-stream',
    upsert: false,
  });
  if (error) throw error;

  const publicUrl = getPublicUrl(bucket, path);
  return { path, publicUrl };
}