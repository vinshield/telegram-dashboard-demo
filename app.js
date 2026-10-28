const agents = [
  ['BigBenz', 'BI', 'Triager', '4 days ago', 'Oct 23, 2026, 3:11 PM', 'z1k1_j1M-d...', 'disconnected', true, false],
  ['Oculus', 'OC', 'Reviewer', '4 days ago', 'Oct 22, 2026, 4:22 PM', 'z1k1_JK7InM...', 'connected', false, true],
  ['Jenny', 'JE', 'Contributor', '3 hrs ago', 'Oct 22, 2026, 2:03 PM', 'z1k1_1IJcHM...', 'connected', true, true]
];
let expanded = -1;
let current = 0;
const root = document.querySelector('#agents');
const modal = document.querySelector('#modal');
const step = document.querySelector('#step');
const globe = '<svg class="globe" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.8 2.7 4 5.7 4 9s-1.2 6.3-4 9c-2.8-2.7-4-5.7-4-9s1.2-6.3 4-9Z"/></svg>';
const arrow = '<svg class="remote-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>';

function render() {
  root.innerHTML = agents.map((a, i) => `
    <article class="card">
      <div class="identity"><div class="avatar">${a[1]}</div><div>
        <div class="name">${a[0]}　<span class="role">${a[2]}</span></div>
        <div class="meta">Last used ${a[3]} · Added ${a[4]}</div>
        <div class="label">Messages and instructions</div>
        <div class="key"><span class="keycode">${a[5]}</span><span>Ziki</span><button class="copy">Copy</button></div>
      </div></div>
      <div class="controls"><select><option>${a[2]}</option></select><select><option>Ziki</option></select>
        <div class="actions"><button>Regenerate key</button><button class="danger">Revoke</button><button class="danger">Delete</button></div>
      </div>
      <button class="remote" data-i="${i}">${globe}<span>Remote</span>${a[6] === 'connected' ? '<i class="remote-status" title="Telegram connected"></i>' : ''}${arrow}</button>
      ${expanded === i ? pane(a, i) : ''}
    </article>`).join('');
  root.querySelectorAll('.remote').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.i);
    expanded = expanded === index ? -1 : index;
    render();
  }));
}

function pane(a, i) {
  const connected = a[6] === 'connected';
  return `<section class="pane">
    <div><h4>Auto-accept offers <span class="toggle ${a[7] ? '' : 'off'}" onclick="toggle(${i},7)"></span></h4>
      <p>Automatically accept incoming offers for this agent.</p>${!a[7] ? '<p>ⓘ Offers require manual acceptance.</p>' : ''}
    </div>
    <div><h4>Notification preference <span class="toggle ${a[8] ? '' : 'off'} ${connected ? '' : 'disabled'}" ${connected ? `onclick="toggle(${i},8)"` : ''}></span></h4>
      <p>Notify on Telegram ${connected ? '' : '<i>(requires a Telegram connection)</i>'}</p>
      <p>Get notified when this agent receives offers or important updates.</p>
    </div>
    <div><h4>Telegram connection</h4>
      ${connected ? '<p>@jesse　 <b class="success">● Connected</b></p>' : '<p>Not connected</p>'}
      <button class="connect" onclick="connect(${i})">${connected ? 'Manage connection' : 'Connect Telegram'}</button>
    </div>
  </section>`;
}

window.toggle = (i, j) => { agents[i][j] = !agents[i][j]; render(); };
window.connect = i => { current = i; showStep(1); };
function showStep(n) {
  modal.classList.remove('hidden');
  const views = {
    1: `<div class="progress">STEP 1 OF 4 · CONNECT TELEGRAM</div><h2>Connect your Telegram</h2><p>We’ll link this agent to your Telegram account so you can receive offer updates.</p><label>Telegram username</label><input id="tguser" class="input" placeholder="@yourusername"><p>We’ll send a secure connection request through our Telegram bot. Your account details stay private.</p><button class="primary" onclick="showStep(2)">Continue</button>`,
    2: `<div class="progress">STEP 2 OF 4 · OPEN TELEGRAM</div><h2>Start a chat with Ziki</h2><p>Open Telegram and press <b>Start</b> to link your account to <b>${agents[current][0]}</b>.</p><div class="qr"></div><p style="text-align:center">Demo connection code: <b>ZI-${Math.floor(1000 + Math.random() * 8999)}</b></p><button class="primary" onclick="showStep(3)">I pressed Start</button>`,
    3: `<div class="progress">STEP 3 OF 4 · VERIFY CONNECTION</div><h2>Confirm it’s you</h2><p>Enter the one-time code sent by the Ziki Telegram bot.</p><input class="input" placeholder="6-digit code" maxlength="6"><button class="primary" onclick="showStep(4)">Verify and connect</button>`,
    4: `<div class="progress">STEP 4 OF 4 · CONNECTED</div><h2 class="success">Telegram connected ✓</h2><p><b>${agents[current][0]}</b> is now linked to ${document.querySelector('#tguser')?.value || '@jesse'}.</p><p>Choose whether this agent should automatically accept offers and send you Telegram updates.</p><button class="primary" onclick="finish()">Done</button>`
  };
  step.innerHTML = views[n];
}
window.showStep = showStep;
window.finish = () => { agents[current][6] = 'connected'; agents[current][8] = true; modal.classList.add('hidden'); render(); };
document.querySelector('#close').onclick = () => modal.classList.add('hidden');
modal.onclick = event => { if (event.target === modal) modal.classList.add('hidden'); };
render();
