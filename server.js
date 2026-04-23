const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Gauri@123',
  database: 'placement_db'
});

db.connect(err => {
  if (err) { console.error('DB connection failed:', err); return; }
  console.log('✅ Connected to MySQL');
});


app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM students ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/students', (req, res) => {
  const { name, branch, cgpa, email, phone } = req.body;
  db.query(
    'INSERT INTO students (name, branch, cgpa, email, phone, status) VALUES (?, ?, ?, ?, ?, "available")',
    [name, branch, cgpa, email, phone],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'Student added' });
    }
  );
});


app.put('/api/students/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, company_name, package: pkg } = req.body;

  if (status === 'placed') {
    db.query('SELECT * FROM students WHERE id = ?', [id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.status(404).json({ error: 'Student not found' });

      const s = rows[0];

      db.query(
        'INSERT INTO placements (student_name, branch, email, phone, cgpa, company_name, package) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [s.name, s.branch, s.email, s.phone, s.cgpa, company_name || s.applied_company || 'N/A', pkg || 0],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          db.query('DELETE FROM students WHERE id = ?', [id], (err3) => {
            if (err3) return res.status(500).json({ error: err3.message });
            res.json({ message: `${s.name} moved to Placements ✅` });
          });
        }
      );
    });
  } else {
    const applied_company = (status === 'applied' || status === 'shortlisted') ? company_name : null;
    db.query(
      'UPDATE students SET status = ?, applied_company = ? WHERE id = ?',
      [status, applied_company, id],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: `Status updated to ${status}` });
      }
    );
  }
});

app.delete('/api/students/:id', (req, res) => {
  db.query('DELETE FROM students WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Student deleted' });
  });
});


app.get('/api/companies', (req, res) => {
  db.query('SELECT * FROM companies ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/companies', (req, res) => {
  const { name, domain, package: pkg, openings } = req.body;
  db.query(
    'INSERT INTO companies (name, domain, package, openings) VALUES (?, ?, ?, ?)',
    [name, domain, pkg, openings],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'Company added' });
    }
  );
});

app.delete('/api/companies/:id', (req, res) => {
  db.query('DELETE FROM companies WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Company deleted' });
  });
});
 

app.get('/api/placements', (req, res) => {
  db.query('SELECT * FROM placements ORDER BY placed_on DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/placements', (req, res) => {
  const { student_name, branch, email, phone, cgpa, company_name, package: pkg } = req.body;
  db.query(
    'INSERT INTO placements (student_name, branch, email, phone, cgpa, company_name, package) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [student_name, branch, email, phone, cgpa, company_name, pkg],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, message: 'Placement added' });
    }
  );
});

app.delete('/api/placements/:id', (req, res) => {
  db.query('DELETE FROM placements WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Placement deleted' });
  });
});


app.get('/api/stats', (req, res) => {
  const stats = {};
  db.query('SELECT COUNT(*) AS cnt FROM students', (e, r) => {
    stats.totalStudents = r[0].cnt;
    db.query('SELECT COUNT(*) AS cnt FROM companies', (e2, r2) => {
      stats.totalCompanies = r2[0].cnt;
      db.query('SELECT COUNT(*) AS cnt FROM placements', (e3, r3) => {
        stats.totalPlaced = r3[0].cnt;
        db.query("SELECT COUNT(*) AS cnt FROM students WHERE status='shortlisted'", (e4, r4) => {
          stats.shortlisted = r4[0].cnt;
          db.query("SELECT COUNT(*) AS cnt FROM students WHERE status='applied'", (e5, r5) => {
            stats.applied = r5[0].cnt;
            res.json(stats);
          });
        });
      });
    });
  });
});

app.listen(3000, () => console.log('🚀 Server running at http://localhost:3000'));