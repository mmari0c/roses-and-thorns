import { createClient } from "@supabase/supabase-js";

const URL = "https://bwrrbzkmobqtwdmzgwgg.supabase.co"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3cnJiemttb2JxdHdkbXpnd2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MjIwNDMsImV4cCI6MjA3OTA5ODA0M30.9GhvUdnx5ymNM6R3jQ7CuJd1KKHtTLwF5_LXbm1zN4A"

export const supabase = createClient(URL, API_KEY);