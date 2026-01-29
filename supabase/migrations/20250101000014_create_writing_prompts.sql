-- writing_prompts
CREATE TABLE IF NOT EXISTS writing_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  requires_two_characters BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_writing_prompts_category ON writing_prompts(category);
CREATE INDEX IF NOT EXISTS idx_writing_prompts_requires_two_characters ON writing_prompts(requires_two_characters);
CREATE INDEX IF NOT EXISTS idx_writing_prompts_is_active ON writing_prompts(is_active);
CREATE INDEX IF NOT EXISTS idx_writing_prompts_created_at ON writing_prompts(created_at DESC);
CREATE OR REPLACE FUNCTION update_writing_prompts_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_writing_prompts_updated_at ON writing_prompts;
CREATE TRIGGER update_writing_prompts_updated_at BEFORE UPDATE ON writing_prompts FOR EACH ROW EXECUTE FUNCTION update_writing_prompts_updated_at();
ALTER TABLE writing_prompts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read active writing prompts" ON writing_prompts;
CREATE POLICY "Public can read active writing prompts" ON writing_prompts FOR SELECT TO public USING (is_active = true);

-- writing_prompt_responses
CREATE TABLE IF NOT EXISTS writing_prompt_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oc_id UUID NOT NULL REFERENCES ocs(id) ON DELETE CASCADE,
  other_oc_id UUID REFERENCES ocs(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  response_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_writing_prompt_responses_oc_id ON writing_prompt_responses(oc_id);
CREATE INDEX IF NOT EXISTS idx_writing_prompt_responses_other_oc_id ON writing_prompt_responses(other_oc_id);
CREATE INDEX IF NOT EXISTS idx_writing_prompt_responses_created_at ON writing_prompt_responses(oc_id, created_at DESC);
CREATE OR REPLACE FUNCTION update_writing_prompt_responses_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_writing_prompt_responses_updated_at ON writing_prompt_responses;
CREATE TRIGGER update_writing_prompt_responses_updated_at BEFORE UPDATE ON writing_prompt_responses FOR EACH ROW EXECUTE FUNCTION update_writing_prompt_responses_updated_at();
