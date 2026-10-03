(function () {
  'use strict';

  const nirfRanking = 'https://www.nirfindia.org/Rankings/2025/EngineeringRanking.html';
  const nirfPdf = (id) => `https://www.nirfindia.org/nirfpdfcdn/2025/pdf/Engineering/${id}.pdf`;
  const colleges = [
    { id:'vit', name:'Vellore Institute of Technology (VIT)', location:'Vellore, Tamil Nadu · multiple campuses', students:35957, placements:4031, rank:'16', nirf:nirfPdf('IR-E-U-0490'), admissions:'https://viteee.vit.ac.in/' },
    { id:'bits', name:'BITS Pilani', location:'Pilani, Rajasthan · Goa and Hyderabad campuses', students:10485, placements:2458, rank:'11', nirf:nirfPdf('IR-E-U-0391'), admissions:'https://www.bitsadmission.com/BITSAT_LP/index.html' },
    { id:'manipal', name:'Manipal Institute of Technology (MAHE)', location:'Manipal, Karnataka', students:8226, placements:1140, rank:'59', nirf:nirfPdf('IR-E-C-7252'), admissions:'https://www.manipal.edu/entrancetest.html' },
    { id:'srm', name:'SRM Institute of Science and Technology', location:'Chennai, Tamil Nadu · multiple campuses', students:20642, placements:4210, rank:'14', nirf:nirfPdf('IR-E-U-0473'), admissions:'https://www.srmist.edu.in/admission-india/' },
    { id:'kiit', name:'Kalinga Institute of Industrial Technology (KIIT)', location:'Bhubaneswar, Odisha', students:13662, placements:1236, rank:'36', nirf:nirfPdf('IR-E-U-0356'), admissions:'https://kiitee.kiit.ac.in/' },
    { id:'amrita', name:'Amrita Vishwa Vidyapeetham', location:'Coimbatore, Tamil Nadu · multiple campuses', students:14045, placements:1879, rank:'23', nirf:nirfPdf('IR-E-U-0436'), admissions:'https://www.amrita.edu/admissions/engineering/' },
    { id:'cu', name:'Chandigarh University', location:'Mohali, Punjab', students:13509, placements:1087, rank:'31', nirf:nirfPdf('IR-E-U-0747'), admissions:'https://cucet.cuchd.in/index.aspx' },
    { id:'lpu', name:'Lovely Professional University (LPU)', location:'Phagwara, Punjab', students:18640, placements:2754, rank:'48', nirf:nirfPdf('IR-E-U-0379'), admissions:'https://www.lpu.in/nest/btech/' },
    { id:'jain', name:'JAIN (Deemed-to-be University), FET', location:'Bengaluru, Karnataka', students:4735, placements:344, rank:'84', nirf:nirfPdf('IR-E-U-0223'), admissions:'https://set.jainuniversity.ac.in/btech-admissions-in-bangalore' },
    { id:'upes', name:'UPES', location:'Dehradun, Uttarakhand', students:6453, placements:1158, rank:'43', nirf:nirfPdf('IR-E-U-0564'), admissions:'https://www.upes.ac.in/admissions/admission-alerts/upeseat' },
    { id:'rvce', name:'R.V. College of Engineering (RVCE)', location:'Bengaluru, Karnataka', students:null, placements:null, rank:'—', nirf:nirfRanking, admissions:'https://rvce.edu.in/' },
    { id:'ramaiah', name:'M. S. Ramaiah Institute of Technology', location:'Bengaluru, Karnataka', students:4814, placements:787, rank:'75', nirf:nirfPdf('IR-E-C-1331'), admissions:'https://www.msrit.edu/admissions.html' },
    { id:'bms', name:'B.M.S. College of Engineering', location:'Bengaluru, Karnataka', students:null, placements:null, rank:'151–200 band', nirf:'https://www.nirfindia.org/Rankings/2025/EngineeringRanking200.html', admissions:'https://bmsce.ac.in/' },
    { id:'dsce', name:'Dayananda Sagar College of Engineering', location:'Bengaluru, Karnataka', students:null, placements:null, rank:'201–300 band', nirf:'https://www.nirfindia.org/Rankings/2025/EngineeringRanking300.html', admissions:'https://admissions.dsce.edu.in/' }
  ];

  const directory = document.getElementById('collegeDirectory');
  const count = document.getElementById('selectionCount');
  const compareButton = document.getElementById('compareButton');
  const clearButton = document.getElementById('clearButton');
  const status = document.getElementById('selectionStatus');
  const results = document.getElementById('compareResults');
  const table = document.getElementById('comparisonTable');
  const selected = new Set();

  function renderDirectory() {
    const rows = colleges.map((college) => {
      const checked = selected.has(college.id);
      const disabled = !checked && selected.size >= 4;
      const students = college.students == null ? 'Not in common NIRF report' : new Intl.NumberFormat('en-IN').format(college.students);
      const placements = college.placements == null ? 'Not in common NIRF report' : new Intl.NumberFormat('en-IN').format(college.placements);
      const rankLink = `<a href="${college.nirf}" target="_blank" rel="noopener noreferrer">${escapeHtml(college.rank)}</a>`;
      return `<tr>
        <td><input type="checkbox" value="${college.id}" aria-label="Select ${escapeHtml(college.name)} for comparison" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}></td>
        <td>${escapeHtml(college.name)}<br><a href="${college.admissions}" target="_blank" rel="noopener noreferrer">Official admissions ↗</a></td>
        <td>${escapeHtml(college.location)}</td>
        <td>${students}</td>
        <td>${placements}</td>
        <td>Not reported comparably</td>
        <td>Not reported comparably</td>
        <td>${rankLink}</td>
        <td>Varies by route, branch, year and category</td>
        <td>Exam score / rank varies by branch and round</td>
      </tr>`;
    }).join('');

    directory.innerHTML = `<table class="directory-table">
      <thead><tr>
        <th scope="col"><span class="visually-hidden">Select</span>Compare</th>
        <th scope="col">College name</th><th scope="col">Location</th>
        <th scope="col">Student count*</th><th scope="col">Placements*</th>
        <th scope="col">Research papers</th><th scope="col">Patents</th>
        <th scope="col">NIRF Engineering rank / band</th>
        <th scope="col">JEE Main cutoff percentile</th><th scope="col">College entrance exam cutoff (percentile / score / rank)</th>
      </tr></thead><tbody>${rows}</tbody></table>`;

    directory.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) selected.add(checkbox.value);
        else selected.delete(checkbox.value);
        status.textContent = '';
        renderDirectory();
        updateControls();
      });
    });
  }

  function updateControls() {
    count.textContent = `${selected.size} / 4 selected`;
    compareButton.disabled = selected.size < 2;
  }

  function cellValue(value, type) {
    if (type === 'students' || type === 'placements') {
      return value == null ? 'Not available in the common NIRF report' : new Intl.NumberFormat('en-IN').format(value);
    }
    return value;
  }

  function renderComparison() {
    const chosen = colleges.filter((college) => selected.has(college.id));
    if (chosen.length < 2 || chosen.length > 4) return;

    const headings = ['<thead><tr><th scope="col">Measure</th>'];
    chosen.forEach((college) => {
      headings.push(`<th scope="col"><a href="${college.nirf}" target="_blank" rel="noopener noreferrer">${college.name}</a></th>`);
    });
    headings.push('</tr></thead>');

    const metrics = [
      ['Location', 'location'],
      ['Student count · UG four-year strength, 2023–24', 'students'],
      ['Placements · UG four-year placed, 2023–24', 'placements'],
      ['Research papers', 'unreported'],
      ['Patents', 'unreported'],
      ['NIRF Engineering 2025 rank / band', 'rank'],
      ['JEE Main cutoff percentile', 'jeeCutoff'],
      ['College entrance exam cutoff (percentile / score / rank)', 'collegeExamCutoff'],
      ['Official admissions / cutoff information', 'admissions']
    ];

    const body = ['<tbody>'];
    metrics.forEach(([label, field]) => {
      body.push(`<tr><th scope="row">${label}</th>`);
      chosen.forEach((college) => {
        let value;
        if (field === 'unreported') value = '<span class="metric-unavailable">Not published in a comparable NIRF 2025 Engineering field</span>';
        else if (field === 'jeeCutoff') value = '<span class="metric-unavailable">No common percentile; depends on whether JEE Main is accepted, plus programme, year and category</span>';
        else if (field === 'collegeExamCutoff') value = '<span class="metric-unavailable">Usually reported as an exam score or rank; varies by branch and counselling round</span>';
        else if (field === 'admissions') value = `<a href="${college.admissions}" target="_blank" rel="noopener noreferrer">Official admissions page</a>`;
        else value = escapeHtml(String(cellValue(college[field], field)));
        body.push(`<td>${value}</td>`);
      });
      body.push('</tr>');
    });
    body.push('</tbody>');
    table.innerHTML = `<table>${headings.join('')}${body.join('')}</table>`;
    results.classList.add('is-visible');
    results.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'start' });
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]);
  }

  compareButton.addEventListener('click', renderComparison);
  clearButton.addEventListener('click', () => {
    selected.clear();
    results.classList.remove('is-visible');
    table.replaceChildren();
    status.textContent = 'Selection cleared.';
    renderDirectory();
    updateControls();
  });

  renderDirectory();
  updateControls();
})();
