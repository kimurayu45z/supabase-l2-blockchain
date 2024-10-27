CREATE OR REPLACE FUNCTION bank_send(
    from_address TEXT,
    to_address TEXT,
    assets JSONB
) RETURNS JSONB AS $$
DECLARE

BEGIN
  BEGIN

  EXCEPTION
    WHEN OTHERS THEN
      RAISE;
  END;
END;
$$ LANGUAGE plpgsql;