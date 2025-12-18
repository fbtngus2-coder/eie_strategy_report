-- 1. input_data 테이블에 V2 분석용 컬럼 추가
-- 이 스크립트를 Supabase SQL Editor에서 실행 'Run' 하세요.

ALTER TABLE input_data ADD COLUMN IF NOT EXISTS operation_info JSONB DEFAULT '{}'::jsonb;
ALTER TABLE input_data ADD COLUMN IF NOT EXISTS facility_info JSONB DEFAULT '{}'::jsonb;
ALTER TABLE input_data ADD COLUMN IF NOT EXISTS instructor_info JSONB DEFAULT '{}'::jsonb;
ALTER TABLE input_data ADD COLUMN IF NOT EXISTS student_info JSONB DEFAULT '{}'::jsonb;
ALTER TABLE input_data ADD COLUMN IF NOT EXISTS tuition_info JSONB DEFAULT '{}'::jsonb;

-- 2. 리포트 보관함 테이블 생성 (저장 기능용)
CREATE TABLE IF NOT EXISTS saved_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title TEXT,
    input_data_id UUID REFERENCES input_data(id),
    report_data JSONB, -- 생성된 리포트 전체 데이터
    summary TEXT,       -- 리포트 요약 (목록 표시용)
    location TEXT      -- 분석 지역 (추가됨)
);

-- 3. 권한 설정 (개발 편의를 위해 모든 권한 허용)
-- saved_reports 테이블 RLS 활성화
ALTER TABLE saved_reports ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (중복 방지)
DROP POLICY IF EXISTS "Enable read access for all users" ON saved_reports;
DROP POLICY IF EXISTS "Enable insert access for all users" ON saved_reports;
DROP POLICY IF EXISTS "Enable update access for all users" ON saved_reports;
DROP POLICY IF EXISTS "Enable delete access for all users" ON saved_reports;

-- 새 정책 적용 (Anon, Authenticated 모두 허용)
CREATE POLICY "Enable read access for all users" ON saved_reports FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON saved_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON saved_reports FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON saved_reports FOR DELETE USING (true);

-- 4. 기존 테이블에 location 컬럼이 없는 경우 추가 (이미 테이블이 생성된 사용자를 위해)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'saved_reports' 
        AND column_name = 'location'
    ) THEN
        ALTER TABLE saved_reports ADD COLUMN location TEXT;
    END IF;
END
$$;

-- input_data 테이블 권한 확실하게 열기 (혹시 막혀있을 경우 대비)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'input_data' AND policyname = 'Enable all access for input_data'
    ) THEN
        CREATE POLICY "Enable all access for input_data" ON input_data FOR ALL USING (true) WITH CHECK (true);
    END IF;
END
$$;
