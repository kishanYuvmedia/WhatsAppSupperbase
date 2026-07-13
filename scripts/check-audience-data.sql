-- Run ALL of these and share the results:

-- 1. How many contacts do you have?
SELECT COUNT(*) AS total_contacts FROM contacts;

-- 2. How many tags exist?
SELECT id, name FROM tags;

-- 3. Are there ANY contact_tags entries?
SELECT COUNT(*) AS total_entries FROM contact_tags;

-- 4. Which contacts are tagged with which tags?
SELECT
  t.name AS tag_name,
  ct.contact_id,
  c.name AS contact_name,
  c.phone
FROM contact_tags ct
JOIN tags t ON t.id = ct.tag_id
LEFT JOIN contacts c ON c.id = ct.contact_id
ORDER BY t.name;

-- 5. Tags with their contact counts
SELECT
  t.name AS tag_name,
  COUNT(ct.contact_id) AS contact_count
FROM tags t
LEFT JOIN contact_tags ct ON ct.tag_id = t.id
GROUP BY t.name;
