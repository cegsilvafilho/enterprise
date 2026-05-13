(() => {
  const STORAGE_KEY = "dignidade360.enterprise.final.v3";
  const SESSION_KEY = "dignidade360.enterprise.session.v1";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const roleLabels = {
    patient: "Paciente",
    professional: "Profissional",
    manager: "Gestor",
  };

  const loginProfiles = {
    patient: {
      actor: "Helena Duarte",
      identifier: "helena.teste@d360.local",
      password: "validacao123",
      patientId: "p-helena",
      label: "E-mail ou CPF do paciente",
      hint: "Conta de teste: Helena Duarte. Senha: validacao123.",
      scope: "Acesso individual ao plano, check-in, agenda, mensagens e consentimento.",
    },
    professional: {
      actor: "Lia Martins",
      identifier: "lia.martins@hospital.local",
      password: "validacao123",
      patientId: "p-rosa",
      label: "E-mail institucional",
      hint: "Conta de teste: lia.martins@hospital.local. Senha: validacao123.",
      scope: "Acesso assistencial aos pacientes vinculados, fila clínica, condutas e jornada.",
    },
    manager: {
      actor: "Rafael Lima",
      identifier: "rafael.lima@hospital.local",
      password: "validacao123",
      patientId: "p-helena",
      label: "E-mail corporativo",
      hint: "Conta de teste: rafael.lima@hospital.local. Senha: validacao123.",
      scope: "Acesso gerencial a indicadores, unidades, relatórios, filas e auditoria.",
    },
  };

  const viewCatalog = {
    dashboard: { label: "Painel", icon: "layout-dashboard", kicker: "Visão 360" },
    patients: { label: "Pacientes", icon: "users", kicker: "Cadastro e acesso" },
    checkin: { label: "Check-in", icon: "activity", kicker: "Sintomas e sofrimento" },
    plan: { label: "Plano de cuidado", icon: "clipboard-list", kicker: "Prontuário 360" },
    queue: { label: "Fila clínica", icon: "list-checks", kicker: "Alertas e SLA" },
    intake: { label: "Implantação", icon: "route", kicker: "Captação e início do cuidado" },
    shifts: { label: "Escalas", icon: "calendar-clock", kicker: "Profissionais e visitas" },
    supplies: { label: "Suprimentos", icon: "package-check", kicker: "Farmácia e materiais" },
    billing: { label: "Faturamento", icon: "receipt", kicker: "Autorizações e receitas" },
    quality: { label: "Experiência", icon: "smile-plus", kicker: "Família e qualidade" },
    agenda: { label: "Agenda", icon: "calendar-days", kicker: "Consultas e contatos" },
    messages: { label: "Mensagens", icon: "messages-square", kicker: "Comunicação segura" },
    education: { label: "Biblioteca", icon: "book-open", kicker: "Conteúdo e orientação" },
    management: { label: "Gestão", icon: "chart-column", kicker: "Operação enterprise" },
    reports: { label: "Relatórios", icon: "file-bar-chart", kicker: "Dados agregados" },
    audit: { label: "Auditoria", icon: "shield-check", kicker: "LGPD e rastreabilidade" },
  };

  const roleViews = {
    patient: ["dashboard", "checkin", "plan", "agenda", "messages", "education", "quality", "audit"],
    professional: ["dashboard", "queue", "patients", "intake", "checkin", "plan", "shifts", "agenda", "messages", "supplies", "quality", "education"],
    manager: ["dashboard", "patients", "queue", "intake", "shifts", "supplies", "billing", "management", "quality", "reports", "audit"],
  };

  const severityOrder = { "Crítico": 4, Alto: 3, Moderado: 2, Baixo: 1 };

  let state = loadState();
  let session = loadSession();
  let ui = {
    modal: null,
    editPatientId: null,
    activeAlertId: null,
    loginRole: "patient",
    search: "",
    filters: {
      status: "Todos",
      priority: "Todos",
      unit: "Todas",
      queue: "Abertos",
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    render();
  });

  function bindEvents() {
    document.addEventListener("click", handleClick);
    document.addEventListener("change", handleChange);
    document.addEventListener("input", handleInput);
    document.addEventListener("submit", handleSubmit);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && ui.modal) {
        closeModal();
      }
    });
  }

  function seedState() {
    const now = new Date();
    const hoursAgo = (hours) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();
    const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
    const daysFromNow = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

    return {
      version: 3,
      role: "manager",
      view: "dashboard",
      selectedPatientId: "p-helena",
      patients: [
        {
          id: "p-helena",
          name: "Helena Duarte",
          record: "D360-0001",
          birth: "1948-04-12",
          phone: "(85) 98888-0001",
          city: "Fortaleza",
          unit: "Atenção domiciliar",
          careLine: "Doença pulmonar avançada",
          diagnosis: "DPOC avançada com dispneia recorrente",
          status: "Ativo",
          priority: "Alto",
          professional: "Dra. Ana Rocha",
          team: "Equipe Norte",
          caregiver: "Maria Lopes",
          caregiverPhone: "(85) 98888-1010",
          goal: "Manter conforto em casa e reduzir idas ao pronto atendimento.",
          preferences: "Prioriza conforto, presença da família e comunicação clara sobre decisões.",
          accessEmail: "helena.teste@d360.local",
          invitedAt: daysAgo(4),
          lastLogin: hoursAgo(8),
          consent: { careTeam: true, caregiver: true, analytics: true, research: false },
          createdAt: daysAgo(18),
        },
        {
          id: "p-joao",
          name: "João Batista Nunes",
          record: "D360-0002",
          birth: "1961-09-23",
          phone: "(85) 98888-0002",
          city: "Caucaia",
          unit: "Ambulatório paliativo",
          careLine: "Insuficiência cardíaca avançada",
          diagnosis: "IC avançada com fadiga e edema",
          status: "Ativo",
          priority: "Moderado",
          professional: "Dr. Paulo Mendes",
          team: "Ambulatório",
          caregiver: "Rita Nunes",
          caregiverPhone: "(85) 98888-2020",
          goal: "Ajustar sintomas, apoiar cuidadora e evitar internações evitáveis.",
          preferences: "Deseja receber orientações por mensagem e acompanhamento telefônico.",
          accessEmail: "joao.teste@d360.local",
          invitedAt: daysAgo(6),
          lastLogin: daysAgo(1),
          consent: { careTeam: true, caregiver: true, analytics: false, research: false },
          createdAt: daysAgo(12),
        },
        {
          id: "p-rosa",
          name: "Rosa Maria Alves",
          record: "D360-0003",
          birth: "1939-12-01",
          phone: "(85) 98888-0003",
          city: "Maracanaú",
          unit: "Hospital Dia",
          careLine: "Fragilidade e demência avançada",
          diagnosis: "Síndrome demencial avançada com fragilidade",
          status: "Monitoramento",
          priority: "Crítico",
          professional: "Dra. Ana Rocha",
          team: "Equipe Hospital Dia",
          caregiver: "Clara Alves",
          caregiverPhone: "(85) 98888-3030",
          goal: "Organizar decisões familiares, prevenir crises e aliviar sobrecarga.",
          preferences: "Família solicita reunião de cuidado compartilhado.",
          accessEmail: "rosa.teste@d360.local",
          invitedAt: daysAgo(2),
          lastLogin: hoursAgo(18),
          consent: { careTeam: true, caregiver: true, analytics: true, research: true },
          createdAt: daysAgo(8),
        },
      ],
      professionals: [
        { id: "pro-ana", name: "Dra. Ana Rocha", role: "Médica paliativista", team: "Equipe Norte" },
        { id: "pro-paulo", name: "Dr. Paulo Mendes", role: "Cardiologista", team: "Ambulatório" },
        { id: "pro-lia", name: "Lia Martins", role: "Enfermeira navegadora", team: "Equipe Hospital Dia" },
      ],
      units: [
        { name: "Atenção domiciliar", capacity: 65, active: 28, slaTarget: 90 },
        { name: "Ambulatório paliativo", capacity: 80, active: 42, slaTarget: 88 },
        { name: "Hospital Dia", capacity: 35, active: 18, slaTarget: 92 },
      ],
      careLines: [
        {
          id: "line-pulmonar",
          name: "Doença pulmonar avançada",
          criteria: "Dispneia recorrente, internações frequentes, necessidade de plano de crise.",
          slaHigh: 2,
          team: "Equipe Norte",
        },
        {
          id: "line-cardio",
          name: "Insuficiência cardíaca avançada",
          criteria: "Sintomas classe funcional avançada, reinternações e fadiga limitante.",
          slaHigh: 4,
          team: "Ambulatório",
        },
        {
          id: "line-fragilidade",
          name: "Fragilidade e demência avançada",
          criteria: "Dependência funcional, decisões compartilhadas e suporte familiar intenso.",
          slaHigh: 3,
          team: "Equipe Hospital Dia",
        },
      ],
      carePlans: {
        "p-helena": {
          goals: ["Controle de dispneia", "Plano de crise visível para família", "Evitar idas evitáveis à emergência"],
          actions: ["Check-in diário", "Ligação de enfermagem se falta de ar maior que 6", "Revisão médica semanal"],
          crisis: ["Sentar em posição confortável", "Ambiente ventilado", "Acionar equipe se dispneia não melhorar"],
          medicinesNote: "Medicamentos e doses reais devem permanecer no prontuário institucional.",
          nextReview: daysFromNow(5).slice(0, 10),
          familyMeeting: daysFromNow(9).slice(0, 10),
        },
        "p-joao": {
          goals: ["Reduzir fadiga", "Monitorar edema e falta de ar", "Apoiar cuidadora principal"],
          actions: ["Check-in 3 vezes por semana", "Teleconsulta se ganho de peso ou edema piorar", "Orientação nutricional"],
          crisis: ["Registrar falta de ar", "Elevar cabeceira", "Acionar equipe em piora progressiva"],
          medicinesNote: "Revisão de medicação apenas pela equipe responsável.",
          nextReview: daysFromNow(7).slice(0, 10),
          familyMeeting: daysFromNow(14).slice(0, 10),
        },
        "p-rosa": {
          goals: ["Aliviar desconforto", "Reduzir sobrecarga familiar", "Definir preferências de cuidado"],
          actions: ["Reunião familiar", "Escala de conforto diária", "Contato ativo com cuidadora"],
          crisis: ["Verificar dor, febre e alimentação", "Evitar deslocamento sem orientação", "Acionar equipe se sonolência súbita"],
          medicinesNote: "Usar somente prescrições validadas pela equipe.",
          nextReview: daysFromNow(2).slice(0, 10),
          familyMeeting: daysFromNow(3).slice(0, 10),
        },
      },
      checkins: [
        {
          id: "chk-1",
          patientId: "p-helena",
          createdAt: hoursAgo(9),
          pain: 5,
          breath: 7,
          anxiety: 6,
          fatigue: 7,
          appetite: 4,
          burden: 6,
          sleep: "Interrompido",
          mobility: "Precisa de ajuda",
          crisis: false,
          note: "Noite com falta de ar e ansiedade.",
          risk: "Alto",
          score: 36,
        },
        {
          id: "chk-2",
          patientId: "p-joao",
          createdAt: daysAgo(1),
          pain: 3,
          breath: 4,
          anxiety: 5,
          fatigue: 6,
          appetite: 6,
          burden: 4,
          sleep: "Bom",
          mobility: "Independente",
          crisis: false,
          note: "Cansaço ao caminhar, sem crise.",
          risk: "Moderado",
          score: 24,
        },
        {
          id: "chk-3",
          patientId: "p-rosa",
          createdAt: hoursAgo(3),
          pain: 8,
          breath: 5,
          anxiety: 7,
          fatigue: 9,
          appetite: 2,
          burden: 9,
          sleep: "Ruim",
          mobility: "Restrito ao leito",
          crisis: true,
          note: "Cuidadora relata piora importante e recusa alimentar.",
          risk: "Crítico",
          score: 53,
        },
      ],
      alerts: [
        {
          id: "alt-1",
          patientId: "p-helena",
          checkinId: "chk-1",
          createdAt: hoursAgo(9),
          dueAt: hoursAgo(5),
          severity: "Alto",
          status: "Em atendimento",
          owner: "Lia Martins",
          title: "Dispneia e ansiedade elevadas",
          description: "Check-in gerou prioridade alta. Avaliar ligação e plano de crise.",
          actions: [{ at: hoursAgo(7), author: "Lia Martins", type: "Ligação", text: "Orientado ambiente ventilado e revisão de sintomas." }],
        },
        {
          id: "alt-2",
          patientId: "p-rosa",
          checkinId: "chk-3",
          createdAt: hoursAgo(3),
          dueAt: hoursAgo(1),
          severity: "Crítico",
          status: "Aberto",
          owner: "Dra. Ana Rocha",
          title: "Crise familiar e piora funcional",
          description: "Crise marcada com fadiga alta, baixa ingesta e sobrecarga do cuidador.",
          actions: [],
        },
      ],
      appointments: [
        {
          id: "apt-1",
          patientId: "p-helena",
          dateTime: daysFromNow(1),
          type: "Teleconsulta",
          professional: "Dra. Ana Rocha",
          location: "Videochamada",
          status: "Agendada",
          notes: "Revisar dispneia, ansiedade e preferências.",
        },
        {
          id: "apt-2",
          patientId: "p-rosa",
          dateTime: daysFromNow(3),
          type: "Reunião familiar",
          professional: "Lia Martins",
          location: "Hospital Dia",
          status: "Agendada",
          notes: "Alinhar plano terapêutico e suporte familiar.",
        },
        {
          id: "apt-3",
          patientId: "p-joao",
          dateTime: daysFromNow(5),
          type: "Retorno ambulatorial",
          professional: "Dr. Paulo Mendes",
          location: "Ambulatório paliativo",
          status: "Agendada",
          notes: "Revisar sintomas cardiovasculares.",
        },
      ],
      messages: [
        {
          id: "msg-1",
          patientId: "p-helena",
          createdAt: hoursAgo(8),
          author: "Maria Lopes",
          fromRole: "patient",
          text: "Hoje ela ficou mais cansada depois do banho. Devo registrar no check-in?",
        },
        {
          id: "msg-2",
          patientId: "p-helena",
          createdAt: hoursAgo(7),
          author: "Lia Martins",
          fromRole: "professional",
          text: "Sim, registre. Se falta de ar passar de 7 ou não aliviar, acione a equipe.",
        },
        {
          id: "msg-3",
          patientId: "p-rosa",
          createdAt: hoursAgo(2),
          author: "Dra. Ana Rocha",
          fromRole: "professional",
          text: "Clara, vamos antecipar a reunião familiar e revisar o plano de conforto.",
        },
      ],
      notes: [
        {
          id: "note-1",
          patientId: "p-helena",
          createdAt: daysAgo(2),
          author: "Dra. Ana Rocha",
          type: "Evolução",
          text: "Paciente e família compreendem foco em conforto e acionamento precoce da equipe.",
        },
        {
          id: "note-2",
          patientId: "p-rosa",
          createdAt: hoursAgo(4),
          author: "Lia Martins",
          type: "Social",
          text: "Cuidadora principal com sinais de exaustão. Sugerido suporte familiar ampliado.",
        },
      ],
      tasks: [
        {
          id: "tsk-1",
          patientId: "p-helena",
          title: "Revisar plano de crise com cuidadora",
          owner: "Lia Martins",
          due: daysFromNow(1).slice(0, 10),
          status: "Aberta",
          category: "Cuidado",
        },
        {
          id: "tsk-2",
          patientId: "p-rosa",
          title: "Agendar reunião familiar antecipada",
          owner: "Dra. Ana Rocha",
          due: daysFromNow(2).slice(0, 10),
          status: "Aberta",
          category: "Família",
        },
      ],
      contents: [
        {
          id: "cnt-1",
          title: "Como registrar sintomas de forma útil",
          category: "Paciente",
          time: "4 min",
          description: "Orienta paciente e cuidador a registrar intensidade, duração e impacto dos sintomas.",
        },
        {
          id: "cnt-2",
          title: "Plano de crise em cuidados paliativos",
          category: "Cuidador",
          time: "6 min",
          description: "Explica sinais de alerta, quando acionar a equipe e como evitar decisões improvisadas.",
        },
        {
          id: "cnt-3",
          title: "Reunião familiar e decisão compartilhada",
          category: "Equipe",
          time: "8 min",
          description: "Roteiro para alinhar objetivos, preferências e responsabilidades com a família.",
        },
        {
          id: "cnt-4",
          title: "Indicadores para coordenação de linha de cuidado",
          category: "Gestão",
          time: "7 min",
          description: "Métricas de adesão, SLA, risco, carga assistencial e resolutividade.",
        },
      ],
      audit: [
        { id: "aud-1", at: hoursAgo(8), actor: "Maria Lopes", action: "Enviou mensagem", target: "Helena Duarte" },
        { id: "aud-2", at: hoursAgo(7), actor: "Lia Martins", action: "Registrou conduta", target: "Helena Duarte" },
        { id: "aud-3", at: hoursAgo(3), actor: "Sistema", action: "Gerou alerta crítico", target: "Rosa Maria Alves" },
      ],
    };
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return seedState();
      const parsed = JSON.parse(saved);
      if (parsed.version !== 3) return seedState();
      return parsed;
    } catch (error) {
      return seedState();
    }
  }

  function loadSession() {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (!parsed?.role || !loginProfiles[parsed.role]) return null;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function saveSession() {
    if (!session) {
      sessionStorage.removeItem(SESSION_KEY);
      return;
    }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function render() {
    renderLogin();
    if (!session) {
      $("#appShell")?.classList.add("hidden");
      renderModal();
      refreshIcons();
      return;
    }
    ensureState();
    $("#loginScreen")?.classList.add("hidden");
    $("#appShell")?.classList.remove("hidden");
    renderSidebar();
    renderTopbar();
    renderView();
    renderModal();
    refreshIcons();
  }

  function ensureState() {
    ensureEnterpriseExtensions();
    if (session) {
      state.role = session.role;
      if (session.role === "patient") state.selectedPatientId = session.patientId;
    }
    const allowed = roleViews[state.role] || roleViews.manager;
    if (!allowed.includes(state.view)) state.view = allowed[0];
    if (!state.patients.some((patient) => patient.id === state.selectedPatientId)) {
      state.selectedPatientId = state.patients[0]?.id || "";
    }
    if (ui.activeAlertId && !state.alerts.some((alert) => alert.id === ui.activeAlertId)) {
      ui.activeAlertId = null;
    }
  }

  function ensureEnterpriseExtensions() {
    const defaults = enterpriseDefaults();
    Object.entries(defaults).forEach(([key, value]) => {
      if (!Array.isArray(state[key])) state[key] = value;
    });
  }

  function enterpriseDefaults() {
    const now = new Date();
    const daysFromNow = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
    const hoursFromNow = (hours) => new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString();
    return {
      intakeStages: [
        { id: "int-1", patientId: "p-helena", stage: "Elegibilidade clínica", status: "Concluída", owner: "Dra. Ana Rocha", due: daysFromNow(-6), blocker: "Critérios paliativos confirmados" },
        { id: "int-2", patientId: "p-helena", stage: "Avaliação social e domicílio", status: "Concluída", owner: "Serviço social", due: daysFromNow(-5), blocker: "Cuidadora principal validada" },
        { id: "int-3", patientId: "p-rosa", stage: "Reunião familiar de implantação", status: "Pendente", owner: "Lia Martins", due: daysFromNow(1), blocker: "Família precisa confirmar representante" },
        { id: "int-4", patientId: "p-joao", stage: "Autorização e plano inicial", status: "Em andamento", owner: "Dr. Paulo Mendes", due: daysFromNow(2), blocker: "Aguardando retorno do convênio" },
      ],
      shifts: [
        { id: "sh-1", patientId: "p-helena", professional: "Lia Martins", role: "Enfermagem", start: hoursFromNow(6), end: hoursFromNow(8), status: "Agendada", location: "Domicílio validado", checklist: "Dor, dispneia, estoque domiciliar e cuidadora" },
        { id: "sh-2", patientId: "p-rosa", professional: "Dra. Ana Rocha", role: "Médica", start: hoursFromNow(26), end: hoursFromNow(27), status: "Agendada", location: "Hospital Dia", checklist: "Reunião familiar e plano de conforto" },
        { id: "sh-3", patientId: "p-joao", professional: "Rita Nunes", role: "Fisioterapia", start: hoursFromNow(30), end: hoursFromNow(31), status: "Pendente de aceite", location: "Ambulatório", checklist: "Funcionalidade, fadiga e orientação domiciliar" },
      ],
      supplies: [
        { id: "sup-1", patientId: "p-helena", name: "Kit dispneia domiciliar", type: "Kit", location: "Domicílio", quantity: 1, minimum: 1, lot: "KIT-2605", expires: daysFromNow(120), status: "Completo" },
        { id: "sup-2", patientId: "p-helena", name: "Oxímetro reserva", type: "Equipamento", location: "Domicílio", quantity: 0, minimum: 1, lot: "EQP-019", expires: daysFromNow(800), status: "Reposição" },
        { id: "sup-3", patientId: "p-rosa", name: "Curativos de conforto", type: "Material", location: "Hospital Dia", quantity: 8, minimum: 10, lot: "MAT-441", expires: daysFromNow(180), status: "Baixo estoque" },
        { id: "sup-4", patientId: "p-joao", name: "Balança domiciliar", type: "Equipamento", location: "Domicílio", quantity: 1, minimum: 1, lot: "EQP-022", expires: daysFromNow(700), status: "Completo" },
      ],
      billingItems: [
        { id: "bill-1", patientId: "p-helena", payer: "Operadora A", package: "Atenção domiciliar paliativa 12h", status: "Autorizado", authorization: "AUT-2605-001", due: daysFromNow(7), value: 18400, margin: 22 },
        { id: "bill-2", patientId: "p-rosa", payer: "Particular", package: "Hospital Dia + reunião familiar", status: "Aguardando aceite", authorization: "PROP-2605-014", due: daysFromNow(2), value: 3200, margin: 31 },
        { id: "bill-3", patientId: "p-joao", payer: "Operadora B", package: "Ambulatório paliativo mensal", status: "Prorrogação pendente", authorization: "AUT-2604-112", due: daysFromNow(3), value: 6900, margin: 18 },
      ],
      qualityReviews: [
        { id: "q-1", patientId: "p-helena", author: "Maria Lopes", score: 9, channel: "App família", createdAt: daysFromNow(-1), text: "Equipe respondeu rápido e explicou o plano de crise." },
        { id: "q-2", patientId: "p-rosa", author: "Clara Alves", score: 7, channel: "Contato ativo", createdAt: daysFromNow(-2), text: "Precisamos de mais clareza sobre horários e próximos passos." },
      ],
    };
  }

  function renderLogin() {
    const screen = $("#loginScreen");
    if (!screen) return;
    screen.classList.toggle("hidden", Boolean(session));
    if (session) return;

    if (!loginProfiles[ui.loginRole]) ui.loginRole = "patient";
    const profile = loginProfiles[ui.loginRole];
    $$(".access-card", screen).forEach((card) => {
      card.classList.toggle("active", card.dataset.loginRole === ui.loginRole);
    });
    $("#loginRole").value = ui.loginRole;
    $("#loginIdentifierLabel").firstChild.textContent = `${profile.label}\n`;
    $("#loginIdentifier").value = profile.identifier;
    $("#loginProfileHint").textContent = profile.hint;
  }

  function renderSidebar() {
    const visiblePatients = visiblePatientsForSession();
    $("#patientSelect").innerHTML = visiblePatients
      .map((patient) => `<option value="${esc(patient.id)}"${patient.id === state.selectedPatientId ? " selected" : ""}>${esc(patient.name)}</option>`)
      .join("");
    $("#patientSelect").disabled = state.role === "patient";

    const context = $("#patientContext");
    context.classList.toggle("hidden", state.role === "manager" && state.view === "management");
    $("#sessionRole").textContent = roleLabels[state.role] || "Perfil";
    $("#sessionActor").textContent = session?.actor || currentActor();
    $("#sessionScope").textContent = session?.scope || "Sessão demonstrativa";

    $("#mainNav").innerHTML = roleViews[state.role]
      .map((view) => {
        const item = viewCatalog[view];
        return `
          <button class="nav-button ${state.view === view ? "active" : ""}" type="button" data-view="${view}">
            <i data-lucide="${item.icon}"></i>
            <span>${item.label}</span>
          </button>
        `;
      })
      .join("");
  }

  function renderTopbar() {
    const current = viewCatalog[state.view];
    const patient = getPatient();
    $("#viewKicker").textContent = `${current.kicker} | ${roleLabels[state.role]}`;
    $("#viewTitle").textContent = current.label;
    $("#viewSubtitle").textContent =
      state.role === "manager"
        ? "Acompanhe operação, indicadores, fila, governança e implantação institucional."
        : `${patient.name} | ${patient.careLine} | ${patient.unit}`;

    const newPatient = $('[data-action="new-patient"]');
    newPatient.classList.toggle("hidden", state.role === "patient");
  }

  function renderView() {
    const root = $("#viewRoot");
    const renderers = {
      dashboard: renderDashboard,
      patients: renderPatients,
      checkin: renderCheckin,
      plan: renderPlan,
      queue: renderQueue,
      intake: renderIntake,
      shifts: renderShifts,
      supplies: renderSupplies,
      billing: renderBilling,
      quality: renderQuality,
      agenda: renderAgenda,
      messages: renderMessages,
      education: renderEducation,
      management: renderManagement,
      reports: renderReports,
      audit: renderAudit,
    };
    root.innerHTML = renderers[state.view] ? renderers[state.view]() : renderDashboard();
  }

  function renderDashboard() {
    const patient = getPatient();
    const metrics = getRoleMetrics();
    const timeline = getTimeline(patient.id).slice(0, 7);

    if (state.role === "manager") {
      return `
        ${renderMetrics(metrics)}
        <div class="grid-main">
          <article class="panel">
            <div class="panel-head">
              <div>
                <p class="eyebrow">Operação</p>
                <h2>Visão consolidada da carteira</h2>
                <p>Pacientes, risco, SLA, adesão e unidades em um único painel.</p>
              </div>
              <button class="button ghost" type="button" data-action="copy-summary">
                <i data-lucide="copy"></i><span>Copiar resumo</span>
              </button>
            </div>
            ${renderRiskBars()}
          </article>
          <article class="panel">
            <div class="panel-head">
              <div><p class="eyebrow">Agora</p><h2>Fila que precisa de atenção</h2></div>
              <span class="pill red">${openAlerts().length} abertos</span>
            </div>
            <div class="card-list">
              ${openAlerts()
                .slice(0, 4)
                .map((alert) => renderAlertCard(alert, false))
                .join("") || renderEmpty("Sem alertas abertos.")}
            </div>
          </article>
        </div>
        <div class="grid-3">
          ${state.units.map(renderUnitCard).join("")}
        </div>
      `;
    }

    return `
      ${renderMetrics(metrics)}
      <div class="grid-main">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Paciente selecionado</p><h2>${esc(patient.name)}</h2></div>
            <span class="status ${statusClass(patient.priority)}">${esc(patient.priority)}</span>
          </div>
          ${renderPatientSummary(patient)}
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Cuidado ativo</p><h2>Plano, crise e próximos passos</h2></div>
            <button class="icon-button" type="button" data-action="open-crisis" title="Plano de crise" aria-label="Plano de crise">
              <i data-lucide="file-warning"></i>
            </button>
          </div>
          ${renderCarePlan(patient.id)}
        </article>
      </div>
      <div class="grid-2">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Jornada longitudinal</p><h2>Timeline</h2></div>
            <span class="pill">${timeline.length} eventos</span>
          </div>
          <div class="timeline">${timeline.map(renderTimelineItem).join("") || renderEmpty("Nenhum evento registrado.")}</div>
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Ações rápidas</p><h2>O que fazer agora</h2></div>
          </div>
          <div class="list">
            ${renderQuickAction("activity", "Enviar check-in", "Registrar sintomas e gerar alerta se necessário.", "checkin")}
            ${renderQuickAction("calendar-plus", "Agendar contato", "Criar teleconsulta, visita ou reunião familiar.", "agenda")}
            ${renderQuickAction("message-square", "Enviar mensagem", "Comunicar a equipe e manter histórico.", "messages")}
          </div>
        </article>
      </div>
    `;
  }

  function renderPatients() {
    if (state.role === "patient") {
      return `
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Meu cadastro</p><h2>Dados e acesso</h2></div>
          </div>
          ${renderPatientSummary(getPatient())}
        </article>
      `;
    }

    const filtered = filteredPatients();
    return `
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Cadastro operacional</p>
            <h2>Inserir, selecionar e organizar pacientes</h2>
          </div>
          <button class="button primary" type="button" data-action="new-patient">
            <i data-lucide="user-plus"></i><span>Novo paciente</span>
          </button>
        </div>
        <div class="filters">
          <input id="patientSearch" type="search" placeholder="Buscar por nome, diagnóstico, cuidador ou unidade" value="${esc(ui.search)}" />
          ${renderFilter("status", ["Todos", "Ativo", "Monitoramento", "Alta administrativa"])}
          ${renderFilter("priority", ["Todos", "Crítico", "Alto", "Moderado", "Baixo"])}
          ${renderFilter("unit", ["Todas", ...unique(state.patients.map((patient) => patient.unit))])}
        </div>
      </article>
      <section class="patient-grid">
        ${filtered.map(renderPatientCard).join("") || renderEmpty("Nenhum paciente encontrado com estes filtros.")}
      </section>
    `;
  }

  function renderCheckin() {
    const patient = getPatient();
    return `
      <div class="grid-main">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Registro de sintomas</p><h2>Check-in de ${esc(patient.name)}</h2></div>
            <span class="pill amber" id="riskPreview">Risco moderado</span>
          </div>
          <form class="form" data-form="checkin">
            <div class="slider-grid">
              ${renderSlider("pain", "Dor", 5)}
              ${renderSlider("breath", "Falta de ar", 4)}
              ${renderSlider("anxiety", "Ansiedade", 5)}
              ${renderSlider("fatigue", "Fadiga", 6)}
              ${renderSlider("appetite", "Apetite", 5)}
              ${renderSlider("burden", "Sobrecarga do cuidador", 5)}
            </div>
            <div class="form-grid">
              <label>Sono
                <select name="sleep">
                  <option>Bom</option>
                  <option selected>Interrompido</option>
                  <option>Ruim</option>
                </select>
              </label>
              <label>Mobilidade
                <select name="mobility">
                  <option>Independente</option>
                  <option selected>Precisa de ajuda</option>
                  <option>Restrito ao leito</option>
                </select>
              </label>
            </div>
            <label class="checkline">
              <input type="checkbox" name="crisis" />
              Houve crise, piora importante ou sofrimento intenso hoje
            </label>
            <label>Observação
              <textarea name="note" rows="4" placeholder="Descreva contexto, horário, gatilhos e o que ajudou."></textarea>
            </label>
            <button class="button primary" type="submit">
              <i data-lucide="send"></i><span>Enviar check-in</span>
            </button>
          </form>
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Automação clínica</p><h2>Como a plataforma reage</h2></div>
          </div>
          <ul class="check-list">
            <li>Risco moderado, alto ou crítico cria alerta na fila profissional.</li>
            <li>Crise marcada ou falta de ar intensa sobe prioridade automaticamente.</li>
            <li>Toda ação gera evento de timeline e trilha de auditoria.</li>
            <li>Gestores enxergam dados agregados por unidade, linha de cuidado e SLA.</li>
          </ul>
          <div class="detail-box">
            <strong>Último check-in</strong>
            ${renderLastCheckin(patient.id)}
          </div>
        </article>
      </div>
    `;
  }

  function renderPlan() {
    const patient = getPatient();
    const plan = getPlan(patient.id);
    const patientTasks = state.tasks.filter((task) => task.patientId === patient.id);
    const notes = state.notes.filter((note) => note.patientId === patient.id).sort(sortByDateDesc);

    return `
      <div class="grid-main">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Prontuário 360</p><h2>${esc(patient.name)}</h2></div>
            <span class="status ${statusClass(patient.priority)}">${esc(patient.priority)}</span>
          </div>
          ${renderPatientSummary(patient)}
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Plano ativo</p><h2>Objetivos e plano de crise</h2></div>
            <button class="button ghost" type="button" data-action="open-crisis"><i data-lucide="file-warning"></i><span>Ver crise</span></button>
          </div>
          ${renderCarePlan(patient.id)}
        </article>
      </div>

      <div class="grid-2">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Atualização</p><h2>Editar plano de cuidado</h2></div>
          </div>
          <form class="form" data-form="plan">
            <label>Objetivos
              <textarea name="goals" rows="4">${esc(plan.goals.join("\n"))}</textarea>
            </label>
            <label>Ações de acompanhamento
              <textarea name="actions" rows="4">${esc(plan.actions.join("\n"))}</textarea>
            </label>
            <label>Plano de crise
              <textarea name="crisis" rows="4">${esc(plan.crisis.join("\n"))}</textarea>
            </label>
            <div class="form-grid">
              <label>Próxima revisão <input type="date" name="nextReview" value="${esc(plan.nextReview)}" /></label>
              <label>Reunião familiar <input type="date" name="familyMeeting" value="${esc(plan.familyMeeting)}" /></label>
            </div>
            <label>Nota de medicação
              <textarea name="medicinesNote" rows="3">${esc(plan.medicinesNote)}</textarea>
            </label>
            <button class="button primary" type="submit"><i data-lucide="save"></i><span>Salvar plano</span></button>
          </form>
        </article>

        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Tarefas e evolução</p><h2>Acompanhamento da equipe</h2></div>
          </div>
          <form class="form" data-form="task">
            <div class="form-grid">
              <label>Tarefa <input name="title" required placeholder="Ex.: Ligar para cuidador" /></label>
              <label>Responsável <input name="owner" required value="${state.role === "patient" ? patient.caregiver : "Lia Martins"}" /></label>
              <label>Prazo <input type="date" name="due" required value="${futureDate(2)}" /></label>
              <label>Categoria
                <select name="category">
                  <option>Cuidado</option>
                  <option>Família</option>
                  <option>Social</option>
                  <option>Administrativo</option>
                </select>
              </label>
            </div>
            <button class="button ghost" type="submit"><i data-lucide="plus"></i><span>Adicionar tarefa</span></button>
          </form>
          <div class="card-list">
            ${patientTasks.map(renderTask).join("") || renderEmpty("Nenhuma tarefa ativa.")}
          </div>
          <form class="form" data-form="note">
            <label>Nova evolução
              <textarea name="text" rows="3" required placeholder="Registre evolução, orientação ou decisão compartilhada."></textarea>
            </label>
            <button class="button primary" type="submit"><i data-lucide="file-plus-2"></i><span>Registrar evolução</span></button>
          </form>
          <div class="card-list">${notes.slice(0, 5).map(renderNote).join("")}</div>
        </article>
      </div>
    `;
  }

  function renderQueue() {
    const alerts = filteredAlerts();
    const selected = getSelectedAlert(alerts);

    return `
      <div class="grid-main">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">SLA assistencial</p><h2>Fila priorizada</h2></div>
            <select id="queueFilter" data-filter="queue">
              ${["Abertos", "Críticos", "SLA vencido", "Todos"].map((item) => `<option${ui.filters.queue === item ? " selected" : ""}>${item}</option>`).join("")}
            </select>
          </div>
          <div class="card-list">
            ${alerts.map((alert) => renderAlertCard(alert, true)).join("") || renderEmpty("Nenhum alerta neste filtro.")}
          </div>
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Conduta</p><h2>${selected ? esc(selected.title) : "Selecione um alerta"}</h2></div>
            ${selected ? `<span class="status ${statusClass(selected.status)}">${esc(selected.status)}</span>` : ""}
          </div>
          ${selected ? renderAlertDetail(selected) : renderEmpty("Escolha um alerta da fila para registrar ação.")}
        </article>
      </div>
    `;
  }

  function renderAgenda() {
    const appointments = visibleAppointments().sort(sortByDateAsc);
    return `
      <div class="grid-main">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Calendário assistencial</p><h2>Próximos contatos</h2></div>
          </div>
          <div class="agenda-list">
            ${appointments.map(renderAppointment).join("") || renderEmpty("Nenhum contato agendado.")}
          </div>
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Novo agendamento</p><h2>Teleconsulta, visita ou reunião</h2></div>
          </div>
          <form class="form" data-form="appointment">
            <label>Paciente
              <select name="patientId" ${state.role === "patient" ? "disabled" : ""}>
                ${state.patients.map((patient) => `<option value="${esc(patient.id)}"${patient.id === state.selectedPatientId ? " selected" : ""}>${esc(patient.name)}</option>`).join("")}
              </select>
            </label>
            <div class="form-grid">
              <label>Data e hora <input type="datetime-local" name="dateTime" required value="${dateTimeLocal(new Date(Date.now() + 24 * 60 * 60 * 1000))}" /></label>
              <label>Tipo
                <select name="type">
                  <option>Teleconsulta</option>
                  <option>Ligação de enfermagem</option>
                  <option>Visita domiciliar</option>
                  <option>Reunião familiar</option>
                  <option>Consulta presencial</option>
                </select>
              </label>
            </div>
            <div class="form-grid">
              <label>Profissional <input name="professional" required value="${state.role === "patient" ? getPatient().professional : "Lia Martins"}" /></label>
              <label>Local <input name="location" required value="Videochamada" /></label>
            </div>
            <label>Observações <textarea name="notes" rows="3"></textarea></label>
            <button class="button primary" type="submit"><i data-lucide="calendar-plus"></i><span>Agendar</span></button>
          </form>
        </article>
      </div>
    `;
  }

  function renderMessages() {
    const patient = getPatient();
    const messages = state.messages.filter((message) => message.patientId === patient.id).sort(sortByDateAsc);
    return `
      <div class="grid-main">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Canal do cuidado</p><h2>Mensagens de ${esc(patient.name)}</h2></div>
            <span class="pill">${messages.length} mensagens</span>
          </div>
          <div class="message-thread">
            ${messages.map(renderMessage).join("") || renderEmpty("Nenhuma mensagem registrada.")}
          </div>
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Nova mensagem</p><h2>Comunicação registrada</h2></div>
          </div>
          <form class="form" data-form="message">
            <label>Assunto
              <select name="subject">
                <option>Sintoma</option>
                <option>Dúvida sobre plano</option>
                <option>Agenda</option>
                <option>Suporte familiar</option>
                <option>Administrativo</option>
              </select>
            </label>
            <label>Mensagem
              <textarea name="text" rows="5" required placeholder="Escreva a mensagem que ficará registrada na jornada."></textarea>
            </label>
            <button class="button primary" type="submit"><i data-lucide="send"></i><span>Enviar mensagem</span></button>
          </form>
        </article>
      </div>
    `;
  }

  function renderEducation() {
    const patient = getPatient();
    return `
      <article class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Biblioteca Dignidade</p>
            <h2>Conteúdo orientado por perfil e linha de cuidado</h2>
          </div>
        </div>
        <div class="content-grid">
          ${state.contents.map(renderContentCard).join("")}
        </div>
      </article>
      <article class="panel">
        <div class="panel-head">
          <div><p class="eyebrow">Recomendado</p><h2>Para ${esc(patient.name)}</h2></div>
        </div>
        <ul class="check-list">
          <li>Revisar plano de crise da linha: ${esc(patient.careLine)}.</li>
          <li>Manter registros objetivos de dor, falta de ar, ansiedade e sobrecarga.</li>
          <li>Usar mensagens para dúvidas não emergenciais e acionar emergência em risco imediato.</li>
        </ul>
      </article>
    `;
  }

  function renderManagement() {
    return `
      ${renderMetrics(getManagerMetrics())}
      <div class="grid-2">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Risco da carteira</p><h2>Distribuição por prioridade</h2></div>
          </div>
          ${renderRiskBars()}
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">SLA</p><h2>Alertas por status</h2></div>
          </div>
          <div class="card-list">${renderSlaRows()}</div>
        </article>
      </div>
      <section class="panel">
        <div class="panel-head">
          <div><p class="eyebrow">Unidades</p><h2>Operação e capacidade</h2></div>
        </div>
        <div class="unit-grid">${state.units.map(renderUnitCard).join("")}</div>
      </section>
      <div class="grid-2">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Linha de cuidado</p><h2>Criar configuração</h2></div>
          </div>
          <form class="form" data-form="care-line">
            <label>Nome <input name="name" required placeholder="Ex.: Doença renal avançada" /></label>
            <label>Critério de entrada <textarea name="criteria" rows="3" required></textarea></label>
            <div class="form-grid">
              <label>SLA alto risco em horas <input type="number" min="1" name="slaHigh" value="4" required /></label>
              <label>Equipe <input name="team" required placeholder="Equipe responsável" /></label>
            </div>
            <button class="button primary" type="submit"><i data-lucide="save"></i><span>Criar linha</span></button>
          </form>
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Linhas ativas</p><h2>Protocolos configurados</h2></div>
          </div>
          <div class="line-grid">${state.careLines.map(renderLineCard).join("")}</div>
        </article>
      </div>
    `;
  }

  function renderReports() {
    const summary = buildSummary();
    return `
      <div class="report-grid">
        <article class="report-card">
          <div class="panel-head">
            <div><p class="eyebrow">Resumo executivo</p><h2>Dados para gestor</h2></div>
            <button class="button ghost" type="button" data-action="copy-summary"><i data-lucide="copy"></i><span>Copiar</span></button>
          </div>
          <pre>${esc(summary)}</pre>
        </article>
        <article class="report-card">
          <div class="panel-head">
            <div><p class="eyebrow">Implementação real</p><h2>Itens indispensáveis</h2></div>
          </div>
          <ul class="check-list">
            <li>Login real por paciente, profissional e gestor com autenticação forte.</li>
            <li>Banco de dados com criptografia, backup e controle de acesso por unidade.</li>
            <li>Integração com prontuário, agenda, mensageria e BI institucional.</li>
            <li>Política de consentimento, auditoria imutável, LGPD e governança médica.</li>
            <li>Protocolos validados pela instituição antes de qualquer uso clínico real.</li>
          </ul>
        </article>
      </div>
    `;
  }

  function renderAudit() {
    const patient = getPatient();
    const patientAudit = state.audit
      .filter((item) => state.role === "manager" || item.target === patient.name)
      .sort(sortByAtDesc)
      .slice(0, 40);

    return `
      <div class="grid-main">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Consentimento</p><h2>${state.role === "manager" ? "Governança da plataforma" : `Permissões de ${esc(patient.name)}`}</h2></div>
          </div>
          ${state.role === "manager" ? renderGovernanceBox() : renderConsentForm(patient)}
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Rastreabilidade</p><h2>Eventos auditáveis</h2></div>
            <span class="pill">${patientAudit.length} eventos</span>
          </div>
          <div class="card-list">${patientAudit.map(renderAuditRow).join("") || renderEmpty("Nenhum evento de auditoria.")}</div>
        </article>
      </div>
    `;
  }

  function renderIntake() {
    const stages = visibleByPatientScope(state.intakeStages, "patientId");
    const pending = stages.filter((stage) => stage.status !== "Concluída");
    return `
      ${renderMetrics([
        { label: "Implantações abertas", value: pending.length, hint: "Captação, elegibilidade e início do cuidado", icon: "route" },
        { label: "Concluídas", value: stages.filter((stage) => stage.status === "Concluída").length, hint: "Pacientes já implantados", icon: "check-circle-2" },
        { label: "Pendências críticas", value: stages.filter((stage) => stage.status === "Pendente").length, hint: "Demandas que impedem o início seguro", icon: "triangle-alert" },
        { label: "Tempo alvo", value: "48h", hint: "Meta para implantação assistencial", icon: "timer" },
      ])}
      <div class="grid-main">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Captação e implantação</p><h2>Esteira de entrada do paciente</h2></div>
          </div>
          <div class="card-list">
            ${stages.map(renderIntakeStage).join("") || renderEmpty("Nenhuma implantação no escopo atual.")}
          </div>
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Checklist de início seguro</p><h2>Antes do primeiro atendimento</h2></div>
          </div>
          <ul class="check-list">
            <li>Elegibilidade clínica e objetivos de cuidado registrados.</li>
            <li>Cuidador principal, consentimento e contatos confirmados.</li>
            <li>Plano de crise, agenda inicial e linha de cuidado definidos.</li>
            <li>Materiais, equipamentos e medicações institucionais reconciliados.</li>
            <li>Autorização financeira ou pacote assistencial validado quando aplicável.</li>
          </ul>
        </article>
      </div>
    `;
  }

  function renderShifts() {
    const shifts = visibleByPatientScope(state.shifts, "patientId").sort(sortByStartAsc);
    return `
      <div class="grid-main">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Escalas e visitas</p><h2>Agenda operacional multiprofissional</h2></div>
          </div>
          <div class="agenda-list">
            ${shifts.map(renderShift).join("") || renderEmpty("Nenhuma escala no escopo atual.")}
          </div>
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Controle operacional</p><h2>Check-in, presença e troca</h2></div>
          </div>
          <ul class="check-list">
            <li>Confirma aceite do profissional antes do plantão ou visita.</li>
            <li>Registra check-in e check-out com horário e local demonstrativo.</li>
            <li>Aponta pendências do checklist ao prontuário 360.</li>
            <li>Permite substituição controlada para reduzir furo de escala.</li>
          </ul>
        </article>
      </div>
    `;
  }

  function renderSupplies() {
    const supplies = visibleByPatientScope(state.supplies, "patientId");
    const low = supplies.filter((item) => item.quantity < item.minimum);
    return `
      ${renderMetrics([
        { label: "Itens monitorados", value: supplies.length, hint: "Materiais, equipamentos e kits", icon: "package" },
        { label: "Reposição", value: low.length, hint: "Abaixo do mínimo operacional", icon: "package-x" },
        { label: "Kits completos", value: supplies.filter((item) => item.status === "Completo").length, hint: "Prontos para cuidado domiciliar", icon: "package-check" },
        { label: "Validade", value: "OK", hint: "Lotes controlados no protótipo", icon: "calendar-check" },
      ])}
      <section class="panel">
        <div class="panel-head">
          <div><p class="eyebrow">Farmácia e materiais</p><h2>Estoque por paciente, domicílio e unidade</h2></div>
        </div>
        <div class="patient-grid">
          ${supplies.map(renderSupplyItem).join("") || renderEmpty("Nenhum item no escopo atual.")}
        </div>
      </section>
    `;
  }

  function renderBilling() {
    const items = state.billingItems;
    const total = items.reduce((sum, item) => sum + item.value, 0);
    const avgMargin = Math.round(items.reduce((sum, item) => sum + item.margin, 0) / Math.max(1, items.length));
    return `
      ${renderMetrics([
        { label: "Receita prevista", value: currency(total), hint: "Carteira demonstrativa", icon: "receipt" },
        { label: "Margem média", value: `${avgMargin}%`, hint: "Pacotes e custos estimados", icon: "chart-no-axes-combined" },
        { label: "Pendências", value: items.filter((item) => item.status !== "Autorizado").length, hint: "Aceite, prorrogação ou autorização", icon: "circle-alert" },
        { label: "Glosas", value: "0", hint: "Monitoramento preparado", icon: "file-warning" },
      ])}
      <article class="panel">
        <div class="panel-head">
          <div><p class="eyebrow">Orçamento e faturamento</p><h2>Pacotes, autorizações e prorrogações</h2></div>
        </div>
        <div class="table-shell">
          <table>
            <thead><tr><th>Paciente</th><th>Pagador</th><th>Pacote</th><th>Status</th><th>Valor</th><th>Margem</th><th>Ação</th></tr></thead>
            <tbody>
              ${items.map(renderBillingRow).join("")}
            </tbody>
          </table>
        </div>
      </article>
    `;
  }

  function renderQuality() {
    const reviews = visibleByPatientScope(state.qualityReviews, "patientId").sort(sortByCreatedDesc);
    const average = Math.round(reviews.reduce((sum, item) => sum + Number(item.score), 0) / Math.max(1, reviews.length));
    return `
      <div class="grid-main">
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Família e experiência</p><h2>Feedback e rotina de cuidado</h2></div>
            <span class="pill green">NPS ${average || 0}/10</span>
          </div>
          <div class="card-list">
            ${reviews.map(renderQualityReview).join("") || renderEmpty("Nenhuma avaliação registrada.")}
          </div>
        </article>
        <article class="panel">
          <div class="panel-head">
            <div><p class="eyebrow">Novo feedback</p><h2>Registrar experiência da família</h2></div>
          </div>
          <form class="form" data-form="quality-review">
            <label>Paciente
              <select name="patientId" ${state.role === "patient" ? "disabled" : ""}>
                ${visiblePatientsForSession().map((patient) => `<option value="${esc(patient.id)}"${patient.id === state.selectedPatientId ? " selected" : ""}>${esc(patient.name)}</option>`).join("")}
              </select>
            </label>
            <div class="form-grid">
              <label>Autor <input name="author" required value="${state.role === "patient" ? getPatient().caregiver : currentActor()}" /></label>
              <label>Nota 0 a 10 <input name="score" type="number" min="0" max="10" required value="9" /></label>
            </div>
            <label>Comentário
              <textarea name="text" rows="4" required placeholder="O que funcionou bem? O que precisa melhorar?"></textarea>
            </label>
            <button class="button primary" type="submit"><i data-lucide="send"></i><span>Registrar feedback</span></button>
          </form>
        </article>
      </div>
    `;
  }

  function renderMetrics(metrics) {
    return `<section class="metrics">${metrics
      .map(
        (metric) => `
          <article class="metric">
            <header><span>${esc(metric.label)}</span><i data-lucide="${metric.icon}"></i></header>
            <strong>${esc(metric.value)}</strong>
            <small>${esc(metric.hint)}</small>
          </article>
        `,
      )
      .join("")}</section>`;
  }

  function getRoleMetrics() {
    if (state.role === "manager") return getManagerMetrics();
    const patient = getPatient();
    const checkin = lastCheckin(patient.id);
    const next = nextAppointment(patient.id);
    const open = state.alerts.filter((alert) => alert.patientId === patient.id && alert.status !== "Resolvido");
    return [
      { label: "Risco atual", value: checkin?.risk || patient.priority, hint: checkin ? `Score ${checkin.score}` : "Sem check-in", icon: "activity" },
      { label: "Alertas abertos", value: open.length, hint: open[0]?.title || "Sem pendências críticas", icon: "bell-ring" },
      { label: "Próximo contato", value: next ? shortDate(next.dateTime) : "Não agendado", hint: next?.type || "Crie um agendamento", icon: "calendar" },
      { label: "Consentimento", value: patient.consent.analytics ? "Completo" : "Parcial", hint: "Permissões editáveis pelo paciente", icon: "shield" },
    ];
  }

  function getManagerMetrics() {
    const open = openAlerts();
    const critical = state.patients.filter((patient) => patient.priority === "Crítico").length;
    const adherence = calculateAdherence();
    const overdue = open.filter(isOverdue).length;
    return [
      { label: "Pacientes ativos", value: state.patients.length, hint: `${state.units.length} unidades conectadas`, icon: "users" },
      { label: "Alto risco", value: critical + state.patients.filter((patient) => patient.priority === "Alto").length, hint: `${critical} críticos`, icon: "siren" },
      { label: "SLA vencido", value: overdue, hint: `${open.length} alertas abertos`, icon: "timer-reset" },
      { label: "Adesão check-in", value: `${adherence}%`, hint: "Registro nos últimos 7 dias", icon: "chart-no-axes-combined" },
    ];
  }

  function renderPatientSummary(patient) {
    return `
      <div class="patient-summary">
        <div>
          <h3>${esc(patient.diagnosis)}</h3>
          <p class="muted">${esc(patient.goal)}</p>
          <div class="patient-meta">
            <span class="tag">${computeAge(patient.birth)} anos</span>
            <span class="tag">${esc(patient.unit)}</span>
            <span class="tag">${esc(patient.careLine)}</span>
            <span class="tag">${esc(patient.professional)}</span>
          </div>
        </div>
        <div class="row-actions">
          ${state.role !== "patient" ? `<button class="button ghost" type="button" data-action="edit-patient" data-id="${esc(patient.id)}"><i data-lucide="pencil"></i><span>Editar</span></button>` : ""}
          ${state.role !== "patient" ? `<button class="button ghost" type="button" data-action="invite-patient" data-id="${esc(patient.id)}"><i data-lucide="mail-plus"></i><span>Acesso</span></button>` : ""}
        </div>
      </div>
      <ul class="compact-list">
        <li><strong>Cuidador:</strong> ${esc(patient.caregiver)} | ${esc(patient.caregiverPhone)}</li>
        <li><strong>Preferências:</strong> ${esc(patient.preferences)}</li>
        <li><strong>E-mail de acesso:</strong> ${esc(patient.accessEmail)} | último acesso: ${patient.lastLogin ? dateTime(patient.lastLogin) : "sem acesso"}</li>
      </ul>
    `;
  }

  function renderCarePlan(patientId) {
    const plan = getPlan(patientId);
    return `
      <div class="care-plan">
        <article><strong>Objetivos</strong><ul>${plan.goals.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article>
        <article><strong>Ações</strong><ul>${plan.actions.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article>
        <article><strong>Crise</strong><ul>${plan.crisis.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article>
        <article><strong>Revisão</strong><p class="muted">Plano: ${shortDate(plan.nextReview)} | Reunião familiar: ${shortDate(plan.familyMeeting)}</p></article>
      </div>
    `;
  }

  function renderQuickAction(icon, title, description, view) {
    return `
      <button class="list-item" type="button" data-view="${view}">
        <div class="timeline-item">
          <span class="timeline-dot"><i data-lucide="${icon}"></i></span>
          <span><strong>${title}</strong><span>${description}</span></span>
        </div>
      </button>
    `;
  }

  function renderPatientCard(patient) {
    const active = patient.id === state.selectedPatientId;
    const last = lastCheckin(patient.id);
    return `
      <article class="patient-card ${active ? "active" : ""}">
        <header>
          <div>
            <h3>${esc(patient.name)}</h3>
            <span class="muted">${esc(patient.record)} | ${computeAge(patient.birth)} anos</span>
          </div>
          <span class="status ${statusClass(patient.priority)}">${esc(patient.priority)}</span>
        </header>
        <p class="muted">${esc(patient.diagnosis)}</p>
        <div class="patient-meta">
          <span class="tag">${esc(patient.unit)}</span>
          <span class="tag">${esc(patient.team)}</span>
          <span class="tag">${last ? `Check-in ${shortDate(last.createdAt)}` : "Sem check-in"}</span>
        </div>
        <div class="row-actions">
          <button class="button ghost" type="button" data-action="select-patient" data-id="${esc(patient.id)}"><i data-lucide="user-round-check"></i><span>Selecionar</span></button>
          <button class="button ghost" type="button" data-action="edit-patient" data-id="${esc(patient.id)}"><i data-lucide="pencil"></i><span>Editar</span></button>
        </div>
      </article>
    `;
  }

  function renderFilter(name, options) {
    return `
      <select data-filter="${name}" aria-label="${name}">
        ${options.map((option) => `<option value="${esc(option)}"${ui.filters[name] === option ? " selected" : ""}>${esc(option)}</option>`).join("")}
      </select>
    `;
  }

  function renderSlider(name, label, value) {
    return `
      <label class="slider-field">
        <div><span>${label}</span><output data-output="${name}">${value}</output></div>
        <input type="range" min="0" max="10" value="${value}" name="${name}" data-symptom />
      </label>
    `;
  }

  function renderLastCheckin(patientId) {
    const item = lastCheckin(patientId);
    if (!item) return `<p class="muted">Ainda não há check-in.</p>`;
    return `
      <p><strong>${esc(item.risk)} | Score ${item.score}</strong></p>
      <p class="muted">${dateTime(item.createdAt)} | ${esc(item.note || "Sem observação")}</p>
    `;
  }

  function renderAlertCard(alert, selectable) {
    const patient = patientById(alert.patientId);
    const selected = ui.activeAlertId === alert.id;
    return `
      <article class="alert-card ${selected ? "selected" : ""}">
        <header>
          <div>
            <strong>${esc(alert.title)}</strong>
            <span>${esc(patient?.name || "Paciente")} | ${dateTime(alert.createdAt)}</span>
          </div>
          <span class="status ${statusClass(alert.severity)}">${esc(alert.severity)}</span>
        </header>
        <p class="muted">${esc(alert.description)}</p>
        <div class="alert-meta">
          <span class="status ${statusClass(alert.status)}">${esc(alert.status)}</span>
          <span class="tag">SLA: ${slaLabel(alert)}</span>
          <span class="tag">Responsável: ${esc(alert.owner)}</span>
        </div>
        ${
          selectable
            ? `<button class="button ghost" type="button" data-action="select-alert" data-id="${esc(alert.id)}"><i data-lucide="mouse-pointer-click"></i><span>Atender</span></button>`
            : ""
        }
      </article>
    `;
  }

  function renderAlertDetail(alert) {
    const patient = patientById(alert.patientId);
    return `
      <div class="detail-box">
        <strong>${esc(patient?.name || "Paciente não encontrado")}</strong>
        <span>${esc(patient?.diagnosis || "")}</span>
        <span>SLA: ${slaLabel(alert)} | Responsável: ${esc(alert.owner)}</span>
      </div>
      <div class="card-list">
        ${(alert.actions || []).map((action) => `
          <article class="list-item">
            <strong>${esc(action.type)} | ${esc(action.author)}</strong>
            <span>${dateTime(action.at)}</span>
            <p>${esc(action.text)}</p>
          </article>
        `).join("") || renderEmpty("Nenhuma conduta registrada.")}
      </div>
      <form class="form" data-form="alert-action">
        <label>Tipo de ação
          <select name="type">
            <option>Ligação</option>
            <option>Orientação</option>
            <option>Escalonamento médico</option>
            <option>Visita domiciliar</option>
            <option>Reunião familiar</option>
          </select>
        </label>
        <label>Conduta
          <textarea name="text" rows="4" required placeholder="Registre a conduta realizada e próximos passos."></textarea>
        </label>
        <div class="inline-actions">
          <button class="button ghost" type="button" data-action="start-alert" data-id="${esc(alert.id)}"><i data-lucide="play"></i><span>Iniciar</span></button>
          <button class="button ghost" type="button" data-action="escalate-alert" data-id="${esc(alert.id)}"><i data-lucide="arrow-up-right"></i><span>Escalonar</span></button>
          <button class="button primary" type="submit"><i data-lucide="clipboard-check"></i><span>Salvar e resolver</span></button>
        </div>
      </form>
    `;
  }

  function renderAppointment(appointment) {
    const patient = patientById(appointment.patientId);
    return `
      <article class="agenda-item">
        <div class="date-badge">
          <span>${shortDate(appointment.dateTime)}</span>
          <small>${timeOnly(appointment.dateTime)}</small>
        </div>
        <div>
          <strong>${esc(appointment.type)} | ${esc(patient?.name || "Paciente")}</strong>
          <p class="muted">${esc(appointment.professional)} | ${esc(appointment.location)}</p>
          <p>${esc(appointment.notes || "")}</p>
        </div>
        <span class="status ${statusClass(appointment.status)}">${esc(appointment.status)}</span>
      </article>
    `;
  }

  function renderMessage(message) {
    const mine = (state.role === "patient" && message.fromRole === "patient") || (state.role !== "patient" && message.fromRole !== "patient");
    return `
      <article class="message ${mine ? "mine" : ""}">
        <strong>${esc(message.author)}</strong>
        <span>${dateTime(message.createdAt)}</span>
        <p>${esc(message.text)}</p>
      </article>
    `;
  }

  function renderContentCard(content) {
    return `
      <article class="content-card">
        <header>
          <div>
            <h3>${esc(content.title)}</h3>
            <span class="muted">${esc(content.category)} | ${esc(content.time)}</span>
          </div>
          <i data-lucide="book-open"></i>
        </header>
        <p>${esc(content.description)}</p>
        <button class="button ghost" type="button" data-action="content-read" data-id="${esc(content.id)}">
          <i data-lucide="check-circle-2"></i><span>Marcar como visto</span>
        </button>
      </article>
    `;
  }

  function renderUnitCard(unit) {
    const percent = Math.min(100, Math.round((unit.active / unit.capacity) * 100));
    return `
      <article class="unit-card">
        <header>
          <strong>${esc(unit.name)}</strong>
          <span class="pill blue">${percent}% ocupação</span>
        </header>
        <div class="progress"><span style="width:${percent}%"></span></div>
        <p class="muted">${unit.active} pacientes ativos de ${unit.capacity} vagas operacionais. Meta SLA: ${unit.slaTarget}%.</p>
      </article>
    `;
  }

  function renderLineCard(line) {
    return `
      <article class="line-card">
        <strong>${esc(line.name)}</strong>
        <span class="muted">${esc(line.criteria)}</span>
        <span class="tag">SLA alto risco: ${line.slaHigh}h</span>
        <span class="tag">${esc(line.team)}</span>
      </article>
    `;
  }

  function renderIntakeStage(stage) {
    const patient = patientById(stage.patientId);
    return `
      <article class="list-item">
        <div class="item-head">
          <div>
            <strong>${esc(stage.stage)}</strong>
            <p>${esc(patient?.name || "Paciente")} | Responsável: ${esc(stage.owner)}</p>
          </div>
          <span class="status ${statusClass(stage.status)}">${esc(stage.status)}</span>
        </div>
        <p class="muted">Prazo: ${shortDate(stage.due)} | ${esc(stage.blocker)}</p>
        ${
          stage.status !== "Concluída" && state.role !== "patient"
            ? `<button class="button ghost" type="button" data-action="advance-intake" data-id="${esc(stage.id)}"><i data-lucide="check-circle-2"></i><span>Concluir etapa</span></button>`
            : ""
        }
      </article>
    `;
  }

  function renderShift(shift) {
    const patient = patientById(shift.patientId);
    return `
      <article class="agenda-item">
        <div class="date-badge">
          <span>${shortDate(shift.start)}</span>
          <small>${timeOnly(shift.start)}</small>
        </div>
        <div>
          <strong>${esc(shift.professional)} | ${esc(shift.role)}</strong>
          <p class="muted">${esc(patient?.name || "Paciente")} | ${esc(shift.location)}</p>
          <p>${esc(shift.checklist)}</p>
        </div>
        <div class="row-actions">
          <span class="status ${statusClass(shift.status)}">${esc(shift.status)}</span>
          ${state.role !== "patient" ? `<button class="button ghost" type="button" data-action="check-shift" data-id="${esc(shift.id)}"><i data-lucide="map-pin-check"></i><span>Check</span></button>` : ""}
        </div>
      </article>
    `;
  }

  function renderSupplyItem(item) {
    const patient = patientById(item.patientId);
    const low = item.quantity < item.minimum;
    return `
      <article class="patient-card">
        <header>
          <div>
            <h3>${esc(item.name)}</h3>
            <span class="muted">${esc(item.type)} | ${esc(item.location)}</span>
          </div>
          <span class="status ${low ? "vencido" : statusClass(item.status)}">${low ? "Reposição" : esc(item.status)}</span>
        </header>
        <p class="muted">${esc(patient?.name || "Paciente")} | lote ${esc(item.lot)} | validade ${shortDate(item.expires)}</p>
        <div class="progress"><span style="width:${Math.min(100, Math.round((item.quantity / Math.max(1, item.minimum)) * 100))}%"></span></div>
        <span class="tag">Saldo: ${item.quantity} | mínimo: ${item.minimum}</span>
        ${state.role !== "patient" ? `<button class="button ghost" type="button" data-action="dispense-supply" data-id="${esc(item.id)}"><i data-lucide="package-plus"></i><span>Registrar reposição</span></button>` : ""}
      </article>
    `;
  }

  function renderBillingRow(item) {
    const patient = patientById(item.patientId);
    return `
      <tr>
        <td>${esc(patient?.name || "Paciente")}</td>
        <td>${esc(item.payer)}</td>
        <td>${esc(item.package)}<br /><span class="muted">${esc(item.authorization)}</span></td>
        <td><span class="status ${statusClass(item.status)}">${esc(item.status)}</span></td>
        <td>${currency(item.value)}</td>
        <td>${item.margin}%</td>
        <td>${item.status !== "Autorizado" ? `<button class="button ghost" type="button" data-action="resolve-billing" data-id="${esc(item.id)}"><i data-lucide="badge-check"></i><span>Autorizar</span></button>` : "OK"}</td>
      </tr>
    `;
  }

  function renderQualityReview(review) {
    const patient = patientById(review.patientId);
    return `
      <article class="message">
        <strong>${esc(review.author)} | Nota ${review.score}/10</strong>
        <span>${esc(patient?.name || "Paciente")} | ${esc(review.channel)} | ${dateTime(review.createdAt)}</span>
        <p>${esc(review.text)}</p>
      </article>
    `;
  }

  function renderRiskBars() {
    const counts = ["Crítico", "Alto", "Moderado", "Baixo"].map((risk) => ({
      risk,
      count: state.patients.filter((patient) => patient.priority === risk).length,
    }));
    const max = Math.max(1, ...counts.map((item) => item.count));
    return `
      <div class="bars">
        ${counts
          .map((item) => {
            const width = Math.max(5, Math.round((item.count / max) * 100));
            const color = item.risk === "Crítico" ? "red" : item.risk === "Alto" ? "amber" : item.risk === "Moderado" ? "blue" : "green";
            return `
              <div class="bar-row">
                <strong>${item.risk}</strong>
                <div class="bar-track"><span class="${color}" style="width:${width}%"></span></div>
                <span>${item.count}</span>
              </div>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderSlaRows() {
    const rows = [
      { label: "Abertos", value: state.alerts.filter((alert) => alert.status === "Aberto").length, cls: "red" },
      { label: "Em atendimento", value: state.alerts.filter((alert) => alert.status === "Em atendimento").length, cls: "blue" },
      { label: "Escalonados", value: state.alerts.filter((alert) => alert.status === "Escalonado").length, cls: "amber" },
      { label: "Resolvidos", value: state.alerts.filter((alert) => alert.status === "Resolvido").length, cls: "green" },
    ];
    return rows
      .map((row) => `<article class="list-item"><strong>${row.label}</strong><span class="pill ${row.cls}">${row.value}</span></article>`)
      .join("");
  }

  function renderTask(task) {
    return `
      <article class="task-row">
        <strong>${esc(task.title)}</strong>
        <span>${esc(task.owner)} | ${shortDate(task.due)} | ${esc(task.category)}</span>
        <div class="row-actions">
          <span class="status ${statusClass(task.status)}">${esc(task.status)}</span>
          ${task.status !== "Concluída" ? `<button class="button ghost" type="button" data-action="complete-task" data-id="${esc(task.id)}"><i data-lucide="check"></i><span>Concluir</span></button>` : ""}
        </div>
      </article>
    `;
  }

  function renderNote(note) {
    return `
      <article class="list-item">
        <strong>${esc(note.type)} | ${esc(note.author)}</strong>
        <span>${dateTime(note.createdAt)}</span>
        <p>${esc(note.text)}</p>
      </article>
    `;
  }

  function renderTimelineItem(item) {
    return `
      <article class="timeline-item">
        <span class="timeline-dot"><i data-lucide="${item.icon}"></i></span>
        <div>
          <strong>${esc(item.title)}</strong>
          <span>${dateTime(item.at)}</span>
          <p>${esc(item.text)}</p>
        </div>
      </article>
    `;
  }

  function renderConsentForm(patient) {
    return `
      <form class="form" data-form="consent">
        <label class="checkline"><input type="checkbox" name="careTeam" ${patient.consent.careTeam ? "checked" : ""} /> Compartilhar dados com equipe assistencial</label>
        <label class="checkline"><input type="checkbox" name="caregiver" ${patient.consent.caregiver ? "checked" : ""} /> Permitir acesso do cuidador autorizado</label>
        <label class="checkline"><input type="checkbox" name="analytics" ${patient.consent.analytics ? "checked" : ""} /> Usar dados anonimizados em indicadores agregados</label>
        <label class="checkline"><input type="checkbox" name="research" ${patient.consent.research ? "checked" : ""} /> Autorizar contato para pesquisa futura</label>
        <button class="button primary" type="submit"><i data-lucide="shield-check"></i><span>Salvar consentimento</span></button>
      </form>
    `;
  }

  function renderGovernanceBox() {
    return `
      <ul class="check-list">
        <li>Paciente acessa somente sua jornada, plano, agenda, mensagens e consentimentos.</li>
        <li>Profissional acessa pacientes vinculados, fila clínica, plano e evolução assistencial.</li>
        <li>Gestor acessa indicadores, operação, linhas de cuidado, relatórios e auditoria agregada.</li>
        <li>Produção real exige autenticação, criptografia, banco de dados, logs imutáveis e LGPD.</li>
      </ul>
    `;
  }

  function renderAuditRow(row) {
    return `
      <article class="audit-row">
        <strong>${esc(row.action)}</strong>
        <span>${dateTime(row.at)} | ${esc(row.actor)} | ${esc(row.target)}</span>
      </article>
    `;
  }

  function renderEmpty(text) {
    return `<div class="empty-state">${esc(text)}</div>`;
  }

  function renderModal() {
    const root = $("#modalRoot");
    if (!ui.modal) {
      root.className = "modal-layer";
      root.innerHTML = "";
      return;
    }
    root.className = "modal-layer open";
    root.innerHTML = ui.modal === "patient" ? renderPatientModal() : renderCrisisModal();
  }

  function renderPatientModal() {
    const editing = ui.editPatientId ? patientById(ui.editPatientId) : null;
    const patient = editing || {
      name: "",
      record: nextRecord(),
      birth: "1970-01-01",
      phone: "",
      city: "",
      unit: "Ambulatório paliativo",
      careLine: state.careLines[0]?.name || "Linha paliativa",
      diagnosis: "",
      status: "Ativo",
      priority: "Moderado",
      professional: "Dra. Ana Rocha",
      team: "Equipe Norte",
      caregiver: "",
      caregiverPhone: "",
      goal: "",
      preferences: "",
      accessEmail: "",
    };

    return `
      <div class="modal-card">
        <div class="panel-head">
          <div><p class="eyebrow">Cadastro de paciente</p><h2>${editing ? "Editar paciente" : "Novo paciente"}</h2></div>
          <button class="icon-button" type="button" data-action="close-modal" aria-label="Fechar"><i data-lucide="x"></i></button>
        </div>
        <form class="form" data-form="patient">
          <div class="form-grid three">
            <label>Nome completo <input name="name" required value="${esc(patient.name)}" /></label>
            <label>Registro <input name="record" required value="${esc(patient.record)}" /></label>
            <label>Nascimento <input type="date" name="birth" required value="${esc(patient.birth)}" /></label>
          </div>
          <div class="form-grid three">
            <label>Telefone <input name="phone" value="${esc(patient.phone)}" /></label>
            <label>Cidade <input name="city" value="${esc(patient.city)}" /></label>
            <label>E-mail de acesso <input type="email" name="accessEmail" value="${esc(patient.accessEmail)}" /></label>
          </div>
          <div class="form-grid three">
            <label>Unidade <input name="unit" required value="${esc(patient.unit)}" /></label>
            <label>Linha de cuidado
              <select name="careLine">
                ${state.careLines.map((line) => `<option${line.name === patient.careLine ? " selected" : ""}>${esc(line.name)}</option>`).join("")}
              </select>
            </label>
            <label>Prioridade
              <select name="priority">
                ${["Baixo", "Moderado", "Alto", "Crítico"].map((item) => `<option${item === patient.priority ? " selected" : ""}>${item}</option>`).join("")}
              </select>
            </label>
          </div>
          <div class="form-grid three">
            <label>Status
              <select name="status">
                ${["Ativo", "Monitoramento", "Alta administrativa"].map((item) => `<option${item === patient.status ? " selected" : ""}>${item}</option>`).join("")}
              </select>
            </label>
            <label>Profissional responsável <input name="professional" required value="${esc(patient.professional)}" /></label>
            <label>Equipe <input name="team" required value="${esc(patient.team)}" /></label>
          </div>
          <div class="form-grid">
            <label>Cuidador principal <input name="caregiver" value="${esc(patient.caregiver)}" /></label>
            <label>Telefone do cuidador <input name="caregiverPhone" value="${esc(patient.caregiverPhone)}" /></label>
          </div>
          <label>Diagnóstico e contexto <textarea name="diagnosis" rows="3" required>${esc(patient.diagnosis)}</textarea></label>
          <label>Objetivo principal de cuidado <textarea name="goal" rows="3" required>${esc(patient.goal)}</textarea></label>
          <label>Preferências e decisões compartilhadas <textarea name="preferences" rows="3">${esc(patient.preferences)}</textarea></label>
          <div class="inline-actions">
            <button class="button primary" type="submit"><i data-lucide="save"></i><span>${editing ? "Salvar alterações" : "Cadastrar paciente"}</span></button>
            <button class="button ghost" type="button" data-action="close-modal">Cancelar</button>
          </div>
        </form>
      </div>
    `;
  }

  function renderCrisisModal() {
    const patient = getPatient();
    const plan = getPlan(patient.id);
    return `
      <div class="modal-card small">
        <div class="panel-head">
          <div><p class="eyebrow">Plano de crise</p><h2>${esc(patient.name)}</h2></div>
          <button class="icon-button" type="button" data-action="close-modal" aria-label="Fechar"><i data-lucide="x"></i></button>
        </div>
        <div class="care-plan">
          <article><strong>Preferência de cuidado</strong><p>${esc(patient.preferences)}</p></article>
          <article><strong>Sinais de atenção</strong><ul>${plan.crisis.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></article>
          <article><strong>Contato</strong><p>Equipe: ${esc(patient.team)} | Responsável: ${esc(patient.professional)} | Cuidador: ${esc(patient.caregiverPhone)}</p></article>
          <article><strong>Segurança</strong><p>Em risco imediato, seguir protocolo institucional e acionar emergência.</p></article>
        </div>
      </div>
    `;
  }

  function handleClick(event) {
    const loginRole = event.target.closest("[data-login-role]");
    if (loginRole) {
      ui.loginRole = loginRole.dataset.loginRole;
      render();
      return;
    }

    const viewButton = event.target.closest("[data-view]");
    if (viewButton) {
      state.view = viewButton.dataset.view;
      saveState();
      render();
      return;
    }

    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === "go-dashboard") state.view = "dashboard";
    if (action === "new-patient") openPatientModal();
    if (action === "edit-patient") openPatientModal(id);
    if (action === "close-modal") closeModal();
    if (action === "open-crisis") openModal("crisis");
    if (action === "select-patient") selectPatient(id);
    if (action === "select-alert") selectAlert(id);
    if (action === "start-alert") updateAlertStatus(id, "Em atendimento");
    if (action === "escalate-alert") updateAlertStatus(id, "Escalonado");
    if (action === "complete-task") completeTask(id);
    if (action === "logout") logout();
    if (action === "advance-intake") advanceIntake(id);
    if (action === "check-shift") checkShift(id);
    if (action === "dispense-supply") dispenseSupply(id);
    if (action === "resolve-billing") resolveBilling(id);
    if (action === "invite-patient") invitePatient(id);
    if (action === "simulate-day") simulateDay();
    if (action === "copy-summary") copySummary();
    if (action === "content-read") markContentRead(id);
    if (action === "reset-demo") resetDemo();

    saveState();
    render();
  }

  function handleChange(event) {
    if (event.target.id === "patientSelect") {
      if (state.role === "patient") return;
      selectPatient(event.target.value);
      saveState();
      render();
      return;
    }

    const filter = event.target.dataset.filter;
    if (filter) {
      ui.filters[filter] = event.target.value;
      render();
      return;
    }

    if (event.target.matches("[data-symptom], [name='sleep'], [name='mobility'], [name='crisis']")) {
      updateRiskPreview(event.target.form);
    }
  }

  function handleInput(event) {
    if (event.target.id === "patientSearch") {
      ui.search = event.target.value;
      render();
      return;
    }

    if (event.target.matches("[data-symptom]")) {
      const output = event.target.closest(".slider-field")?.querySelector("output");
      if (output) output.value = event.target.value;
      updateRiskPreview(event.target.form);
    }
  }

  function handleSubmit(event) {
    const form = event.target;
    const type = form.dataset.form;
    if (!type) return;
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    const handlers = {
      login: () => login(data),
      patient: () => savePatient(data),
      checkin: () => saveCheckin(form),
      "alert-action": () => saveAlertAction(data),
      appointment: () => saveAppointment(data),
      message: () => saveMessage(data),
      plan: () => savePlan(data),
      task: () => saveTask(data),
      note: () => saveNote(data),
      "care-line": () => saveCareLine(data),
      "quality-review": () => saveQualityReview(data),
      consent: () => saveConsent(form),
    };

    handlers[type]?.();
    saveState();
    render();
  }

  function login(data) {
    const profile = loginProfiles[data.role] || loginProfiles.patient;
    const identifier = String(data.identifier || "").trim().toLowerCase();
    const password = String(data.password || "");
    const expected = profile.identifier.toLowerCase();

    if (identifier !== expected || password !== profile.password) {
      toast("Acesso não autorizado para este perfil de teste.");
      return;
    }

    session = {
      role: data.role,
      actor: profile.actor,
      patientId: profile.patientId,
      scope: profile.scope,
      loggedAt: new Date().toISOString(),
    };
    state.role = session.role;
    state.selectedPatientId = session.patientId;
    state.view = roleViews[session.role][0];
    audit("Sistema", `Login ${roleLabels[session.role]}`, session.actor);
    saveSession();
    saveState();
    toast(`Bem-vindo, ${session.actor}.`);
  }

  function logout() {
    audit("Sistema", "Logout", session?.actor || "Usuário");
    session = null;
    ui.activeAlertId = null;
    closeModal();
    saveSession();
    toast("Sessão encerrada.");
  }

  function savePatient(data) {
    const editing = ui.editPatientId ? patientById(ui.editPatientId) : null;
    const base = {
      id: editing?.id || uid("p"),
      name: data.name.trim(),
      record: data.record.trim(),
      birth: data.birth,
      phone: data.phone.trim(),
      city: data.city.trim(),
      unit: data.unit.trim(),
      careLine: data.careLine,
      diagnosis: data.diagnosis.trim(),
      status: data.status,
      priority: data.priority,
      professional: data.professional.trim(),
      team: data.team.trim(),
      caregiver: data.caregiver.trim(),
      caregiverPhone: data.caregiverPhone.trim(),
      goal: data.goal.trim(),
      preferences: data.preferences.trim(),
      accessEmail: data.accessEmail.trim(),
      invitedAt: editing?.invitedAt || null,
      lastLogin: editing?.lastLogin || null,
      consent: editing?.consent || { careTeam: true, caregiver: true, analytics: false, research: false },
      createdAt: editing?.createdAt || new Date().toISOString(),
    };

    if (editing) {
      state.patients = state.patients.map((patient) => (patient.id === editing.id ? base : patient));
      audit(currentActor(), "Atualizou cadastro", base.name);
      toast("Paciente atualizado.");
    } else {
      state.patients.unshift(base);
      state.carePlans[base.id] = {
        goals: [base.goal],
        actions: ["Check-in inicial", "Definir plano de crise", "Validar preferências com família"],
        crisis: ["Acionar equipe se houver piora importante", "Seguir apenas orientações prescritas", "Em risco imediato, acionar emergência"],
        medicinesNote: "Medicamentos reais devem ser mantidos no prontuário institucional.",
        nextReview: futureDate(7),
        familyMeeting: futureDate(14),
      };
      state.selectedPatientId = base.id;
      audit(currentActor(), "Cadastrou paciente", base.name);
      toast("Paciente cadastrado e selecionado.");
    }

    closeModal();
  }

  function saveCheckin(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    const values = {
      pain: Number(data.pain),
      breath: Number(data.breath),
      anxiety: Number(data.anxiety),
      fatigue: Number(data.fatigue),
      appetite: Number(data.appetite),
      burden: Number(data.burden),
      sleep: data.sleep,
      mobility: data.mobility,
      crisis: Boolean(data.crisis),
      note: data.note.trim(),
    };
    const risk = calculateRisk(values);
    const checkin = {
      id: uid("chk"),
      patientId: state.selectedPatientId,
      createdAt: new Date().toISOString(),
      ...values,
      risk: risk.label,
      score: risk.score,
    };
    state.checkins.unshift(checkin);
    updatePatientPriority(checkin.patientId, risk.label);
    audit(currentActor(), `Enviou check-in ${risk.label}`, getPatient().name);

    if (risk.label !== "Baixo") {
      createAlertFromCheckin(checkin);
      toast(`Check-in salvo. Alerta ${risk.label.toLowerCase()} criado na fila.`);
    } else {
      toast("Check-in salvo sem alerta clínico.");
    }
  }

  function saveAlertAction(data) {
    const alert = getSelectedAlert(state.alerts);
    if (!alert) return;
    const patient = patientById(alert.patientId);
    alert.actions = alert.actions || [];
    alert.actions.push({
      at: new Date().toISOString(),
      author: currentActor(),
      type: data.type,
      text: data.text.trim(),
    });
    alert.status = "Resolvido";
    alert.resolvedAt = new Date().toISOString();
    state.notes.unshift({
      id: uid("note"),
      patientId: alert.patientId,
      createdAt: new Date().toISOString(),
      author: currentActor(),
      type: "Conduta",
      text: `${data.type}: ${data.text.trim()}`,
    });
    audit(currentActor(), "Resolveu alerta", patient?.name || "Paciente");
    toast("Conduta salva e alerta resolvido.");
  }

  function saveAppointment(data) {
    const patientId = state.role === "patient" ? state.selectedPatientId : data.patientId;
    const patient = patientById(patientId);
    state.appointments.unshift({
      id: uid("apt"),
      patientId,
      dateTime: new Date(data.dateTime).toISOString(),
      type: data.type,
      professional: data.professional.trim(),
      location: data.location.trim(),
      status: "Agendada",
      notes: data.notes.trim(),
    });
    audit(currentActor(), "Criou agendamento", patient?.name || "Paciente");
    toast("Agendamento criado.");
  }

  function saveMessage(data) {
    const patient = getPatient();
    state.messages.push({
      id: uid("msg"),
      patientId: patient.id,
      createdAt: new Date().toISOString(),
      author: currentActor(),
      fromRole: state.role === "patient" ? "patient" : "professional",
      text: `[${data.subject}] ${data.text.trim()}`,
    });
    audit(currentActor(), "Enviou mensagem", patient.name);
    toast("Mensagem enviada.");
  }

  function savePlan(data) {
    const patient = getPatient();
    state.carePlans[patient.id] = {
      goals: lines(data.goals),
      actions: lines(data.actions),
      crisis: lines(data.crisis),
      medicinesNote: data.medicinesNote.trim(),
      nextReview: data.nextReview,
      familyMeeting: data.familyMeeting,
    };
    audit(currentActor(), "Atualizou plano de cuidado", patient.name);
    toast("Plano atualizado.");
  }

  function saveTask(data) {
    const patient = getPatient();
    state.tasks.unshift({
      id: uid("tsk"),
      patientId: patient.id,
      title: data.title.trim(),
      owner: data.owner.trim(),
      due: data.due,
      status: "Aberta",
      category: data.category,
    });
    audit(currentActor(), "Criou tarefa", patient.name);
    toast("Tarefa adicionada.");
  }

  function saveNote(data) {
    const patient = getPatient();
    state.notes.unshift({
      id: uid("note"),
      patientId: patient.id,
      createdAt: new Date().toISOString(),
      author: currentActor(),
      type: state.role === "patient" ? "Relato do paciente" : "Evolução",
      text: data.text.trim(),
    });
    audit(currentActor(), "Registrou evolução", patient.name);
    toast("Evolução registrada.");
  }

  function saveCareLine(data) {
    state.careLines.unshift({
      id: uid("line"),
      name: data.name.trim(),
      criteria: data.criteria.trim(),
      slaHigh: Number(data.slaHigh),
      team: data.team.trim(),
    });
    audit(currentActor(), "Criou linha de cuidado", data.name.trim());
    toast("Linha de cuidado criada.");
  }

  function saveQualityReview(data) {
    const patientId = state.role === "patient" ? state.selectedPatientId : data.patientId;
    const patient = patientById(patientId);
    state.qualityReviews.unshift({
      id: uid("q"),
      patientId,
      author: data.author.trim(),
      score: clamp(Number(data.score), 0, 10),
      channel: state.role === "patient" ? "App paciente/família" : "Registro profissional",
      createdAt: new Date().toISOString(),
      text: data.text.trim(),
    });
    audit(currentActor(), "Registrou feedback da família", patient?.name || "Paciente");
    toast("Feedback registrado.");
  }

  function saveConsent(form) {
    const patient = getPatient();
    patient.consent = {
      careTeam: Boolean(form.elements.careTeam.checked),
      caregiver: Boolean(form.elements.caregiver.checked),
      analytics: Boolean(form.elements.analytics.checked),
      research: Boolean(form.elements.research.checked),
    };
    audit(patient.name, "Atualizou consentimento", patient.name);
    toast("Consentimento atualizado.");
  }

  function createAlertFromCheckin(checkin) {
    const patient = patientById(checkin.patientId);
    const hours = checkin.risk === "Crítico" ? 1 : checkin.risk === "Alto" ? 4 : 12;
    state.alerts.unshift({
      id: uid("alt"),
      patientId: checkin.patientId,
      checkinId: checkin.id,
      createdAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(),
      severity: checkin.risk,
      status: "Aberto",
      owner: patient?.professional || "Equipe assistencial",
      title: `Check-in ${checkin.risk.toLowerCase()} registrado`,
      description: `Score ${checkin.score}. Dor ${checkin.pain}, falta de ar ${checkin.breath}, ansiedade ${checkin.anxiety}, fadiga ${checkin.fatigue}.`,
      actions: [],
    });
  }

  function updateAlertStatus(id, status) {
    const alert = state.alerts.find((item) => item.id === id);
    if (!alert) return;
    alert.status = status;
    alert.actions = alert.actions || [];
    alert.actions.push({
      at: new Date().toISOString(),
      author: currentActor(),
      type: status,
      text: status === "Escalonado" ? "Alerta escalonado para avaliação prioritária." : "Atendimento iniciado.",
    });
    audit(currentActor(), `Marcado alerta como ${status}`, patientById(alert.patientId)?.name || "Paciente");
    toast(`Alerta marcado como ${status.toLowerCase()}.`);
  }

  function completeTask(id) {
    const task = state.tasks.find((item) => item.id === id);
    if (!task) return;
    task.status = "Concluída";
    task.completedAt = new Date().toISOString();
    audit(currentActor(), "Concluiu tarefa", patientById(task.patientId)?.name || "Paciente");
    toast("Tarefa concluída.");
  }

  function advanceIntake(id) {
    const stage = state.intakeStages.find((item) => item.id === id);
    if (!stage) return;
    stage.status = "Concluída";
    stage.completedAt = new Date().toISOString();
    audit(currentActor(), "Concluiu etapa de implantação", patientById(stage.patientId)?.name || "Paciente");
    toast("Etapa de implantação concluída.");
  }

  function checkShift(id) {
    const shift = state.shifts.find((item) => item.id === id);
    if (!shift) return;
    shift.status = shift.status === "Em atendimento" ? "Concluída" : "Em atendimento";
    if (shift.status === "Em atendimento") shift.checkinAt = new Date().toISOString();
    if (shift.status === "Concluída") shift.checkoutAt = new Date().toISOString();
    audit(currentActor(), `Atualizou escala para ${shift.status}`, patientById(shift.patientId)?.name || "Paciente");
    toast(`Escala marcada como ${shift.status.toLowerCase()}.`);
  }

  function dispenseSupply(id) {
    const item = state.supplies.find((supply) => supply.id === id);
    if (!item) return;
    item.quantity = Math.max(item.minimum, item.quantity + item.minimum);
    item.status = "Completo";
    audit(currentActor(), "Registrou reposição de suprimento", patientById(item.patientId)?.name || "Paciente");
    toast("Reposição registrada.");
  }

  function resolveBilling(id) {
    const item = state.billingItems.find((billing) => billing.id === id);
    if (!item) return;
    item.status = "Autorizado";
    item.authorizedAt = new Date().toISOString();
    audit(currentActor(), "Autorizou pacote/faturamento", patientById(item.patientId)?.name || "Paciente");
    toast("Item financeiro autorizado.");
  }

  function invitePatient(id) {
    const patient = patientById(id);
    if (!patient) return;
    patient.invitedAt = new Date().toISOString();
    audit(currentActor(), "Gerou convite de acesso", patient.name);
    toast(`Convite demonstrativo gerado para ${patient.accessEmail || patient.name}.`);
  }

  function selectPatient(id) {
    if (!state.patients.some((patient) => patient.id === id)) return;
    state.selectedPatientId = id;
    ui.activeAlertId = null;
  }

  function selectAlert(id) {
    ui.activeAlertId = id;
    const alert = state.alerts.find((item) => item.id === id);
    if (alert) state.selectedPatientId = alert.patientId;
  }

  function openPatientModal(id = null) {
    ui.modal = "patient";
    ui.editPatientId = id;
  }

  function openModal(name) {
    ui.modal = name;
  }

  function closeModal() {
    ui.modal = null;
    ui.editPatientId = null;
  }

  function simulateDay() {
    state.patients.forEach((patient) => {
      const baseline = patient.priority === "Crítico" ? 8 : patient.priority === "Alto" ? 6 : patient.priority === "Moderado" ? 4 : 2;
      const values = {
        pain: clamp(randomAround(baseline), 0, 10),
        breath: clamp(randomAround(baseline), 0, 10),
        anxiety: clamp(randomAround(baseline), 0, 10),
        fatigue: clamp(randomAround(baseline + 1), 0, 10),
        appetite: clamp(10 - randomAround(baseline), 0, 10),
        burden: clamp(randomAround(baseline), 0, 10),
        sleep: baseline > 6 ? "Ruim" : baseline > 4 ? "Interrompido" : "Bom",
        mobility: baseline > 7 ? "Restrito ao leito" : baseline > 4 ? "Precisa de ajuda" : "Independente",
        crisis: baseline > 7 && Math.random() > 0.45,
        note: "Evento simulado para teste operacional.",
      };
      const risk = calculateRisk(values);
      const checkin = {
        id: uid("chk"),
        patientId: patient.id,
        createdAt: new Date().toISOString(),
        ...values,
        risk: risk.label,
        score: risk.score,
      };
      state.checkins.unshift(checkin);
      updatePatientPriority(patient.id, risk.label);
      if (risk.label !== "Baixo") createAlertFromCheckin(checkin);
    });
    audit("Sistema", "Simulou dia operacional", "Carteira completa");
    toast("Dia simulado com check-ins e alertas fictícios.");
  }

  function resetDemo() {
    if (!window.confirm("Restaurar os dados fictícios iniciais?")) return;
    state = seedState();
    ui = { modal: null, editPatientId: null, activeAlertId: null, loginRole: session?.role || "patient", search: "", filters: { status: "Todos", priority: "Todos", unit: "Todas", queue: "Abertos" } };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    toast("Demonstração restaurada.");
  }

  function markContentRead(id) {
    const content = state.contents.find((item) => item.id === id);
    audit(currentActor(), "Marcou conteúdo como visto", content?.title || "Biblioteca");
    toast("Conteúdo marcado como visto.");
  }

  function copySummary() {
    const summary = buildSummary();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(summary)
        .then(() => toast("Resumo copiado para a área de transferência."))
        .catch(() => {
          state.view = "reports";
          saveState();
          render();
          toast("Não consegui copiar automaticamente; abri o relatório para leitura.");
        });
      return;
    }
    state.view = "reports";
    saveState();
    render();
      toast("Resumo pronto no painel de relatórios.");
  }

  function calculateRisk(values) {
    let score =
      values.pain * 1.2 +
      values.breath * 1.6 +
      values.anxiety +
      values.fatigue +
      (10 - values.appetite) * 0.8 +
      values.burden * 1.1;
    if (values.sleep === "Ruim") score += 3;
    if (values.mobility === "Restrito ao leito") score += 4;
    if (values.crisis) score += 12;
    score = Math.round(score);

    let label = "Baixo";
    if (score >= 42 || values.crisis || values.breath >= 8 || values.pain >= 9) label = "Crítico";
    else if (score >= 32) label = "Alto";
    else if (score >= 20) label = "Moderado";
    return { label, score };
  }

  function updateRiskPreview(form) {
    if (!form) return;
    const data = Object.fromEntries(new FormData(form).entries());
    const risk = calculateRisk({
      pain: Number(data.pain || 0),
      breath: Number(data.breath || 0),
      anxiety: Number(data.anxiety || 0),
      fatigue: Number(data.fatigue || 0),
      appetite: Number(data.appetite || 0),
      burden: Number(data.burden || 0),
      sleep: data.sleep || "Bom",
      mobility: data.mobility || "Independente",
      crisis: Boolean(data.crisis),
    });
    const preview = $("#riskPreview");
    if (!preview) return;
    preview.textContent = `Risco ${risk.label.toLowerCase()} | score ${risk.score}`;
    preview.className = `pill ${risk.label === "Crítico" ? "red" : risk.label === "Alto" ? "amber" : risk.label === "Moderado" ? "blue" : "green"}`;
  }

  function visiblePatientsForSession() {
    if (state.role === "patient") {
      return state.patients.filter((patient) => patient.id === session?.patientId);
    }
    return state.patients;
  }

  function visibleByPatientScope(items, patientKey) {
    if (state.role === "patient") {
      return items.filter((item) => item[patientKey] === state.selectedPatientId);
    }
    return items;
  }

  function filteredPatients() {
    const term = ui.search.trim().toLowerCase();
    return visiblePatientsForSession()
      .filter((patient) => {
        const haystack = [patient.name, patient.diagnosis, patient.caregiver, patient.unit, patient.careLine, patient.professional].join(" ").toLowerCase();
        if (term && !haystack.includes(term)) return false;
        if (ui.filters.status !== "Todos" && patient.status !== ui.filters.status) return false;
        if (ui.filters.priority !== "Todos" && patient.priority !== ui.filters.priority) return false;
        if (ui.filters.unit !== "Todas" && patient.unit !== ui.filters.unit) return false;
        return true;
      })
      .sort((a, b) => (severityOrder[b.priority] || 0) - (severityOrder[a.priority] || 0));
  }

  function filteredAlerts() {
    let alerts = state.alerts.slice().sort((a, b) => (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0) || new Date(a.dueAt) - new Date(b.dueAt));
    if (state.role === "professional") {
      alerts = alerts.filter((alert) => patientById(alert.patientId));
    }
    if (ui.filters.queue === "Abertos") alerts = alerts.filter((alert) => alert.status !== "Resolvido");
    if (ui.filters.queue === "Críticos") alerts = alerts.filter((alert) => alert.severity === "Crítico");
    if (ui.filters.queue === "SLA vencido") alerts = alerts.filter((alert) => alert.status !== "Resolvido" && isOverdue(alert));
    return alerts;
  }

  function visibleAppointments() {
    if (state.role === "manager") return state.appointments;
    return state.appointments.filter((appointment) => appointment.patientId === state.selectedPatientId);
  }

  function getTimeline(patientId) {
    const checkins = state.checkins
      .filter((item) => item.patientId === patientId)
      .map((item) => ({ at: item.createdAt, icon: "activity", title: `Check-in ${item.risk}`, text: item.note || `Score ${item.score}` }));
    const alerts = state.alerts
      .filter((item) => item.patientId === patientId)
      .map((item) => ({ at: item.createdAt, icon: "bell-ring", title: item.title, text: `${item.status} | ${item.description}` }));
    const notes = state.notes
      .filter((item) => item.patientId === patientId)
      .map((item) => ({ at: item.createdAt, icon: "file-text", title: `${item.type} | ${item.author}`, text: item.text }));
    const appointments = state.appointments
      .filter((item) => item.patientId === patientId)
      .map((item) => ({ at: item.dateTime, icon: "calendar", title: `${item.type} agendada`, text: `${item.professional} | ${item.location}` }));
    return [...checkins, ...alerts, ...notes, ...appointments].sort((a, b) => new Date(b.at) - new Date(a.at));
  }

  function getSelectedAlert(alerts) {
    if (ui.activeAlertId) {
      const active = state.alerts.find((alert) => alert.id === ui.activeAlertId);
      if (active) return active;
    }
    const first = alerts[0] || null;
    if (first) {
      ui.activeAlertId = first.id;
      return first;
    }
    return null;
  }

  function getPatient() {
    return patientById(state.selectedPatientId) || state.patients[0];
  }

  function patientById(id) {
    return state.patients.find((patient) => patient.id === id);
  }

  function getPlan(patientId) {
    return (
      state.carePlans[patientId] || {
        goals: ["Definir objetivo principal de cuidado"],
        actions: ["Realizar avaliação inicial"],
        crisis: ["Definir sinais de alerta"],
        medicinesNote: "Sem nota registrada.",
        nextReview: futureDate(7),
        familyMeeting: futureDate(14),
      }
    );
  }

  function lastCheckin(patientId) {
    return state.checkins.filter((item) => item.patientId === patientId).sort(sortByDateDesc)[0];
  }

  function nextAppointment(patientId) {
    return state.appointments
      .filter((item) => item.patientId === patientId && new Date(item.dateTime) >= new Date())
      .sort(sortByDateAsc)[0];
  }

  function openAlerts() {
    return state.alerts.filter((alert) => alert.status !== "Resolvido");
  }

  function updatePatientPriority(patientId, risk) {
    const patient = patientById(patientId);
    if (!patient) return;
    if ((severityOrder[risk] || 0) > (severityOrder[patient.priority] || 0) || risk === "Baixo") {
      patient.priority = risk;
    }
  }

  function calculateAdherence() {
    if (!state.patients.length) return 0;
    const threshold = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const adherent = state.patients.filter((patient) => {
      const checkin = lastCheckin(patient.id);
      return checkin && new Date(checkin.createdAt).getTime() >= threshold;
    }).length;
    return Math.round((adherent / state.patients.length) * 100);
  }

  function buildSummary() {
    const metrics = getManagerMetrics();
    const linesText = metrics.map((metric) => `${metric.label}: ${metric.value} (${metric.hint})`).join("\n");
    const alertsText = openAlerts()
      .slice(0, 8)
      .map((alert) => {
        const patient = patientById(alert.patientId);
        return `- ${alert.severity}: ${patient?.name || "Paciente"} | ${alert.title} | SLA ${slaLabel(alert)}`;
      })
      .join("\n");
    return `Dignidade 360 - resumo operacional\n\n${linesText}\n\nAlertas abertos:\n${alertsText || "Sem alertas abertos."}\n\nObservação: protótipo local com dados fictícios; produção exige backend, autenticação, banco de dados e LGPD.`;
  }

  function audit(actor, action, target) {
    state.audit.unshift({
      id: uid("aud"),
      at: new Date().toISOString(),
      actor,
      action,
      target,
    });
  }

  function currentActor() {
    if (session?.actor) return session.actor;
    if (state.role === "patient") return getPatient().name;
    if (state.role === "professional") return "Lia Martins";
    return "Rafael Lima";
  }

  function uid(prefix) {
    const random = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().slice(0, 8) : Math.random().toString(16).slice(2, 10);
    return `${prefix}-${random}`;
  }

  function nextRecord() {
    const next = state.patients.length + 1;
    return `D360-${String(next).padStart(4, "0")}`;
  }

  function lines(value) {
    return String(value || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function randomAround(base) {
    return Math.round(base + Math.random() * 4 - 2);
  }

  function isOverdue(alert) {
    return new Date(alert.dueAt) < new Date();
  }

  function slaLabel(alert) {
    if (alert.status === "Resolvido") return "resolvido";
    const diff = new Date(alert.dueAt).getTime() - Date.now();
    const hours = Math.ceil(Math.abs(diff) / (60 * 60 * 1000));
    return diff < 0 ? `${hours}h vencido` : `${hours}h restantes`;
  }

  function statusClass(value) {
    return String(value || "neutro")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function esc(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function computeAge(birth) {
    const born = new Date(birth);
    const today = new Date();
    let age = today.getFullYear() - born.getFullYear();
    const monthDiff = today.getMonth() - born.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < born.getDate())) age -= 1;
    return age;
  }

  function dateTime(value) {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(new Date(value));
  }

  function shortDate(value) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
      const [year, month, day] = String(value).split("-");
      return `${day}/${month}`;
    }
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(new Date(value));
  }

  function timeOnly(value) {
    return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));
  }

  function futureDate(days) {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  }

  function dateTimeLocal(date) {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 16);
  }

  function currency(value) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Number(value || 0));
  }

  function sortByDateDesc(a, b) {
    return new Date(b.createdAt || b.dateTime) - new Date(a.createdAt || a.dateTime);
  }

  function sortByDateAsc(a, b) {
    return new Date(a.dateTime || a.createdAt) - new Date(b.dateTime || b.createdAt);
  }

  function sortByStartAsc(a, b) {
    return new Date(a.start) - new Date(b.start);
  }

  function sortByCreatedDesc(a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  }

  function sortByAtDesc(a, b) {
    return new Date(b.at) - new Date(a.at);
  }

  function toast(message) {
    const node = $("#toast");
    node.textContent = message;
    node.classList.add("show");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => node.classList.remove("show"), 2800);
  }

  function refreshIcons() {
    if (window.lucide) window.lucide.createIcons();
  }
})();
