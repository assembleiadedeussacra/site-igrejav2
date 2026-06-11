-- Atualiza e-mail de contato exibido no site (Footer, Contato, schema.org)
UPDATE site_settings
SET email = 'contato@assembleiadedeussacramento.com.br',
    updated_at = NOW();
