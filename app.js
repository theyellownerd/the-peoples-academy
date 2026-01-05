const APP = document.getElementById("app");
const CFG = {
  // YOU WILL PASTE THESE IN STEP 5
  SUPABASE_URL: "https://qqazafynfnwchygoqfoe.supabaseClient.co",
  SUPABASE_ANON: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYXphZnluZm53Y2h5Z29xZm9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NDIwMzksImV4cCI6MjA4MzIxODAzOX0.OCGrE3NmPBDNZFsT1o1fbZMkvYcI-tf84LNGWqBfGI4",

  ADMIN_EMAIL: "brandonesmart@gmail.com",
  TAB_FAIL_THRESHOLD: 4,
  MIN_EXAM_SECONDS: 120,
  EXAM_TIME_LIMIT_SECONDS: 900
};

const { tracks, questions } = window.PEOPLES_ACADEMY;
const supabaseClient = window.supabaseClient.createClient(
  CFG.SUPABASE_URL,
  CFG.SUPABASE_ANON
);

function html(strings, ...vals){
  return strings.map((s,i)=> s + (vals[i] ?? "")).join("");
}

function shuffle(a){
  const b = [...a];
  for (let i=b.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [b[i],b[j]]=[b[j],b[i]];
  }
  return b;
}

function pickQuestions({track, moduleId, count, exam=false}){
  let eligible = questions.filter(q => q.track === track);
  eligible = exam ? eligible.filter(q => !q.module) : eligible.filter(q => q.module === moduleId);
  return shuffle(eligible).slice(0, count);
}

async function getUser(){
  const { data } = await supabaseClient.auth.getUser();
  return data.user;
}

async function requireUser(){
  const user = await getUser();
  if (!user) {
    renderLogin();
    return null;
  }
  return user;
}

async function getProfile(user){
  const { data, error } = await supabaseClient.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
  if (error) throw error;
  return data;
}

function renderLogin(msg=""){
  APP.innerHTML = html`
    <div class="card">
      <div class="pill">Free</div><div class="pill">You own it</div><div class="pill">Email verified</div>
      <h3>Login to The People’s Academy</h3>
      <p class="muted">We use email verification to keep certificates and records clean.</p>
      ${msg ? `<p class="danger">${msg}</p>` : ""}
      <div class="row">
        <input id="email" placeholder="Email address" />
        <button id="sendLink">Send verification link</button>
      </div>
      <p class="muted">Check your email, click the link, and you’ll come right back here logged in.</p>
    </div>
  `;
  document.getElementById("sendLink").onclick = async () => {
    const email = document.getElementById("email").value.trim();
    if (!email) return renderLogin("Enter an email.");
    const redirectTo = window.location.href;
    const { error } = await supabaseClient.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    if (error) return renderLogin(error.message);
    renderLogin("Link sent. Check your email.");
  };
}

async function renderProfile(user){
  APP.innerHTML = html`
    <div class="card">
      <h3>Finish setup</h3>
      <p class="muted">Required for certificates and score tracking.</p>
      <div class="row two">
        <div><label class="muted">First name</label><input id="first" /></div>
        <div><label class="muted">Last name</label><input id="last" /></div>
      </div>
      <div class="row">
        <div><label class="muted">Email</label><input id="email" value="${user.email || ""}" disabled /></div>
        <button id="save">Save profile</button>
      </div>
    </div>
  `;
  document.getElementById("save").onclick = async () => {
    const first = document.getElementById("first").value.trim();
    const last = document.getElementById("last").value.trim();
    if (!first || !last) return alert("First and last name required.");
    const payload = { user_id: user.id, first_name: first, last_name: last, email: user.email };
    const { error } = await supabaseClient.from("profiles").upsert(payload);
    if (error) return alert(error.message);
    renderHome();
  };
}

async function renderHome(){
  const user = await requireUser(); if (!user) return;
  const profile = await getProfile(user);
  if (!profile) return renderProfile(user);

  APP.innerHTML = html`
    <div class="card">
      <h3>Welcome, ${profile.first_name}</h3>
      <p class="muted">Pick a track. Each has unique lessons, knowledge checks, a final exam, and its own certificate. 100% required.</p>
      <div class="row">
        ${Object.entries(tracks).map(([k,t]) => `
          <div class="card">
            <h4>${t.title}</h4>
            <p class="muted">${t.certTitle}</p>
            <button onclick="window.__goTrack('${k}')">Start</button>
          </div>
        `).join("")}
      </div>
      <div class="card">
        <h4>Admin</h4>
        <p class="muted">To download learner data: Supabase Table Editor → export CSV (profiles/attempts/certificates).</p>
        <p class="muted">Admin email on file: ${CFG.ADMIN_EMAIL}</p>
        <button class="secondary" id="logout">Logout</button>
      </div>
    </div>
  `;

  document.getElementById("logout").onclick = async () => {
    await supabaseClient.auth.signOut();
    renderLogin();
  };
}

window.__goTrack = async function(trackKey){
  const user = await requireUser(); if (!user) return;
  const profile = await getProfile(user);
  if (!profile) return renderProfile(user);

  const t = tracks[trackKey];
  APP.innerHTML = html`
    <div class="card">
      <button class="secondary" onclick="window.__home()">← Home</button>
      <h3>${t.title}</h3>
      <p class="muted">Complete modules, pass knowledge checks (100%), then take the final exam.</p>
      <div class="row">
        ${t.modules.map(m => `
          <div class="card">
            <h4>${m.id}: ${m.title}</h4>
            <p class="muted">${m.pages.length} lesson pages</p>
            <button onclick="window.__module('${trackKey}','${m.id}')">Open Module</button>
          </div>
        `).join("")}
      </div>
      <div class="card">
        <h4>Final Exam</h4>
        <p class="muted">${t.examCount} questions, timed, tab-switch monitored. 100% required.</p>
        <button onclick="window.__exam('${trackKey}')">Start Exam</button>
      </div>
    </div>
  `;
};

window.__home = renderHome;

window.__module = function(trackKey, moduleId){
  const t = tracks[trackKey];
  const m = t.modules.find(x => x.id === moduleId);
  APP.innerHTML = html`
    <div class="card">
      <button class="secondary" onclick="window.__goTrack('${trackKey}')">← Back</button>
      <h3>${trackKey.toUpperCase()} ${m.id}: ${m.title}</h3>
      ${m.pages.map((p,idx)=>`
        <div class="card">
          <div class="pill">Page ${idx+1}/${m.pages.length}</div>
          <h4>${p.t}</h4>
          <p>${p.b}</p>
        </div>
      `).join("")}
      <div class="card">
        <h4>Knowledge Check</h4>
        <p class="muted">${tracks[trackKey].kcCount} questions. 100% required.</p>
        <button onclick="window.__kc('${trackKey}','${m.id}')">Start Knowledge Check</button>
      </div>
    </div>
  `;
};

window.__kc = async function(trackKey, moduleId){
  const user = await requireUser(); if (!user) return;

  const t = tracks[trackKey];
  const qs = pickQuestions({track:trackKey, moduleId, count:t.kcCount, exam:false});
  const answers = {};

  function renderKC(){
    APP.innerHTML = html`
      <div class="card">
        <button class="secondary" onclick="window.__module('${trackKey}','${moduleId}')">← Back</button>
        <h3>Knowledge Check: ${trackKey.toUpperCase()} ${moduleId}</h3>
        <p class="muted">100% required. You can retry.</p>
        ${qs.map((q,idx)=>`
          <div class="q">
            <b>${idx+1}. ${q.prompt}</b>
            <div style="margin-top:8px;">
              ${q.choices.map((c,i)=>`
                <label style="display:block;margin:6px 0;">
                  <input type="radio" name="${q.id}" ${answers[q.id]===i ? "checked":""}
                    onclick="window.__pick('${q.id}',${i})" />
                  ${c}
                </label>
              `).join("")}
            </div>
          </div>
        `).join("")}
        <button onclick="window.__submitKC()">Submit</button>
        <div id="kcmsg"></div>
      </div>
    `;
  }

  window.__pick = (qid, idx) => { answers[qid]=idx; };

  window.__submitKC = async () => {
    const correct = qs.filter(q => answers[q.id] === q.ans).length;
    const score = Math.round((correct/qs.length)*100);
    const passed = score === 100;

    await supabaseClient.from("attempts").insert({
      user_id: user.id,
      track: trackKey,
      assessment_type: "kc",
      module_id: moduleId,
      score_percent: score,
      passed,
      duration_seconds: 0,
      tab_switch_count: 0,
      flagged: !passed,
      meta: { question_ids: qs.map(x=>x.id) }
    });

    const el = document.getElementById("kcmsg");
    if (!passed){
      el.innerHTML = `<p class="danger">Score ${score}%. 100% required. Review and retry.</p>`;
      return;
    }
    el.innerHTML = `<p class="ok">Passed with 100%.</p>`;
  };

  renderKC();
};

window.__exam = async function(trackKey){
  const user = await requireUser(); if (!user) return;

  const t = tracks[trackKey];
  const qs = pickQuestions({track:trackKey, count:t.examCount, exam:true});
  const answers = {};
  let idx = 0;

  let tabSwitch = 0;
  let started = Date.now();

  const onVis = () => {
    if (document.hidden) tabSwitch++;
  };
  document.addEventListener("visibilitychange", onVis);

  function timeLeft(){
    const elapsed = Math.floor((Date.now()-started)/1000);
    return Math.max(0, CFG.EXAM_TIME_LIMIT_SECONDS - elapsed);
  }

  function renderQ(msg=""){
    const q = qs[idx];
    APP.innerHTML = html`
      <div class="card">
        <button class="secondary" onclick="window.__goTrack('${trackKey}')">← Quit</button>
        <h3>Final Exam: ${tracks[trackKey].title}</h3>
        <p class="muted">Time left: <b>${timeLeft()}s</b> | Tab switches: <b>${tabSwitch}</b></p>
        ${msg ? `<p class="danger">${msg}</p>` : ""}
        <div class="q">
          <b>Q${idx+1}/${qs.length}: ${q.prompt}</b>
          <div style="margin-top:8px;">
            ${q.choices.map((c,i)=>`
              <label style="display:block;margin:6px 0;">
                <input type="radio" name="${q.id}" ${answers[q.id]===i ? "checked":""}
                  onclick="window.__pickExam('${q.id}',${i})" />
                ${c}
              </label>
            `).join("")}
          </div>
        </div>

        <div style="display:flex;gap:10px;">
          ${idx < qs.length-1
            ? `<button onclick="window.__nextExam()">Next</button>`
            : `<button onclick="window.__submitExam()">Submit Exam</button>`
          }
        </div>
      </div>
    `;
  }

  window.__pickExam = (qid, a) => { answers[qid]=a; };

  window.__nextExam = () => {
    if (timeLeft()===0) return renderQ("Time expired. Exam failed.");
    if (tabSwitch > CFG.TAB_FAIL_THRESHOLD) return renderQ("Too many tab switches. Exam failed.");
    idx++;
    renderQ();
  };

  window.__submitExam = async () => {
    const elapsed = Math.floor((Date.now()-started)/1000);
    const expired = timeLeft()===0;
    const tabFail = tabSwitch > CFG.TAB_FAIL_THRESHOLD;
    const tooFast = elapsed < CFG.MIN_EXAM_SECONDS;
    const autoFail = expired || tabFail || tooFast;

    const correct = qs.filter(q => answers[q.id] === q.ans).length;
    const score = Math.round((correct/qs.length)*100);
    const passed = (!autoFail) && score === 100;

    document.removeEventListener("visibilitychange", onVis);

    await supabaseClient.from("attempts").insert({
      user_id: user.id,
      track: trackKey,
      assessment_type: "exam",
      module_id: null,
      score_percent: passed ? 100 : score,
      passed,
      duration_seconds: elapsed,
      tab_switch_count: tabSwitch,
      flagged: autoFail || !passed,
      meta: { question_ids: qs.map(x=>x.id), expired, tabFail, tooFast }
    });

    if (!passed){
      const reasons = [
        expired ? "time expired" : null,
        tabFail ? "tab switching" : null,
        tooFast ? "completed too fast" : null
      ].filter(Boolean).join(", ");
      return renderQ(`Not passed. Score ${score}%. 100% required. ${reasons ? "Flagged: "+reasons+"." : ""}`);
    }

    // issue certificate row
    await supabaseClient.from("certificates").insert({ user_id: user.id, track: trackKey });

    // generate and download PDF
    await downloadCertificate(trackKey);

    APP.innerHTML = html`
      <div class="card">
        <h3 class="ok">Passed: 100%</h3>
        <p class="muted">Certificate downloaded.</p>
        <button onclick="window.__goTrack('${trackKey}')">Back to Track</button>
        <button class="secondary" onclick="window.__home()">Home</button>
      </div>
    `;
  };

  renderQ();
};

async function downloadCertificate(trackKey){
  const user = await getUser();
  const profile = await getProfile(user);

  const { PDFDocument, StandardFonts } = PDFLib;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const t = tracks[trackKey];
  const issued = new Date().toLocaleDateString();

  page.drawText("Certificate of Completion", { x: 60, y: 520, size: 28, font: bold });
  page.drawText(t.certTitle, { x: 60, y: 480, size: 18, font: bold });
  page.drawText(`Awarded to: ${profile.first_name} ${profile.last_name}`, { x: 60, y: 420, size: 18, font });
  page.drawText(`Completed on: ${issued}`, { x: 60, y: 390, size: 14, font });
  page.drawText("Requirement: 100% passing score on final exam.", { x: 60, y: 90, size: 11, font });
  page.drawText("Signed: Brandon Smart", { x: 60, y: 260, size: 14, font: bold });

  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `The_Peoples_Academy_${trackKey}_Certificate.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

async function boot(){
  // handle login callback (Supabase sets session automatically)
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return renderLogin();

  const user = await getUser();
  const profile = await getProfile(user);
  if (!profile) return renderProfile(user);

  renderHome();
}

boot();
