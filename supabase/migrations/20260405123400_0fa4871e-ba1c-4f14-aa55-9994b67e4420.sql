
CREATE TABLE public.prompt_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  test_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  execution_time_ms INTEGER,
  ai_model TEXT,
  tested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prompt_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage test results"
ON public.prompt_test_results
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can insert test results"
ON public.prompt_test_results
FOR INSERT
WITH CHECK (true);

CREATE INDEX idx_prompt_test_results_prompt_id ON public.prompt_test_results(prompt_id);
CREATE INDEX idx_prompt_test_results_status ON public.prompt_test_results(status);
