-- Allow anonymous inserts for setup purposes (CAUTION: For dev only)
create policy "Enable insert for anon" on marketing_calendar for insert with check (true);
create policy "Enable all access for anon" on input_data for all using (true) with check (true);
