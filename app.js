// ======= Catálogo (exemplo) =======
// Estrutura padrão de um item:
// {
//   id: 'rx300',
//   fabricante: 'Fabricante X',
//   modelo: 'RX 300',
//   categoria: 'Roteadores',
//   conectividade: ['wifi','cabo'],
//   reset: ['botao','interface','padrao'],
//   resumo: 'Roteador dual-band AC1200 com WPS e QoS.',
//   passos: [ { t:'Reset físico (botão)', steps:[ 'Com o aparelho ligado, pressione o botão RESET por 10–12s até o LED piscar.', 'Aguarde o reboot (2–3 min).', 'Após reiniciar, acesse a interface pelo IP padrão.' ] },
//            { t:'Reset via interface', steps:[ 'Acesse o painel (ex.: http://192.168.0.1).', 'Entre em Administração > Backup/Reset.', 'Clique em “Restaurar padrões”.' ] }, ],
//   infos: [ ['IP padrão','192.168.0.1'], ['Usuário padrão','admin'], ['Senha padrão','admin'] ],
//   observacoes: 'Alguns lotes exigem segurar o botão até todos LEDs piscarem.',
//   referencias: [ { rotulo:'Manual oficial (página 12)', url:'#' } ]
// }

document.addEventListener('DOMContentLoaded', () => {
  const $q = s => document.querySelector(s);

  const results   = $q('#results');
  const search    = $q('#search');
  const category  = $q('#category');
  const chipReset = $q('#chip-reset');
  const chipCon   = $q('#chip-con');
  const drawer    = $q('#drawer');
  const dTitle    = $q('#d-title');
  const dMeta     = $q('#d-meta');
  const dBody     = $q('#d-body');

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  let state = { q:'', cat:'', reset:'', con:'' };

  function applyFilters(){
    const q = state.q.trim().toLowerCase();
    const out = data.filter(it=>{
      const matchesQ = !q || [it.modelo,it.categoria,(it.resumo||'')].join(' ').toLowerCase().includes(q);
      const matchesCat = !state.cat || it.categoria===state.cat;
      const matchesReset = !state.reset || (it.reset||[]).includes(state.reset);
      const matchesCon = !state.con || (it.conectividade||[]).includes(state.con);
      return matchesQ && matchesCat && matchesReset && matchesCon;
    });
    renderCards(out);
  }

  function renderCards(list){
    if (!results) return;
    results.innerHTML = '';
    if(!list.length){
      results.innerHTML = `<div class="notice">Nenhum resultado. Ajuste os filtros ou refine sua busca.</div>`;
      return;
    }
    list.forEach(it=>{
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="badge">${it.categoria}</div>
        <div class="title">${it.modelo}</div>
        <div class="specs">${it.resumo||''}</div>
        <div class="specs">Conectividade: ${(it.conectividade||[]).join(', ')||'—'}</div>
        <button class="btn" aria-label="Abrir detalhes de ${it.modelo}">Ver detalhes</button>
      `;
      card.querySelector('.btn').addEventListener('click', ()=>openDrawer(it));
      results.appendChild(card);
    });
  }

  function openDrawer(it){
    if (!drawer) return alert('Sem componente de detalhes no HTML (#drawer).');

    if (dTitle) dTitle.textContent = `${it.modelo}`;
    if (dMeta) {
      dMeta.innerHTML = '';
      (it.infos||[]).forEach(([k,v])=>{
        const tag = document.createElement('span');
        tag.className='badge';
        tag.textContent = `${k}: ${v}`;
        dMeta.appendChild(tag);
      });
    }

    const body = document.createElement('div');
    (it.passos||[]).forEach((grp)=>{
      const section = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = grp.t;
      section.appendChild(title);
      grp.steps.forEach((s,idx)=>{
        const row = document.createElement('div');
        row.className = 'step';
        row.innerHTML = `<div class="n">${idx+1}</div><div>${s}</div>`;
        section.appendChild(row);
      });
      body.appendChild(section);
    });

    if(it.observacoes){
      const warn = document.createElement('div');
      warn.className='step warn';
      warn.innerHTML = `<div class="n">!</div><div><b>Observações:</b> ${it.observacoes}</div>`;
      body.appendChild(warn);
    }

    if((it.referencias||[]).length){
      const refs = document.createElement('div');
      refs.innerHTML = '<h3>Referências</h3>';
      it.referencias.forEach(r=>{
        const a = document.createElement('a');
        a.href = r.url; a.target = '_blank'; a.rel='noopener';
        a.textContent = r.rotulo;
        refs.appendChild(a);
        refs.appendChild(document.createElement('br'));
      });
      body.appendChild(refs);
    }

    if (dBody) {
      dBody.innerHTML = '';
      dBody.appendChild(body);
    }

    // <dialog> seguro (fallback se o navegador não suportar showModal)
    if (typeof drawer.showModal === 'function') {
      try { drawer.showModal(); } catch { drawer.setAttribute('open', ''); }
    } else {
      drawer.setAttribute('open','');
    }
  }

  const btnClose = document.getElementById('close');
  if (btnClose && drawer) {
    btnClose.addEventListener('click', ()=> {
      if (typeof drawer.close === 'function') drawer.close();
      else drawer.removeAttribute('open');
    });
  }
  if (drawer) {
    drawer.addEventListener('click', e=>{ if(e.target===drawer) {
      if (typeof drawer.close === 'function') drawer.close();
      else drawer.removeAttribute('open');
    }});
  }

  if (search)  search.addEventListener('input', e=>{ state.q = e.target.value; applyFilters(); });
  if (category) category.addEventListener('change', e=>{ state.cat = e.target.value; applyFilters(); });

  function wireChips(container, key){
    if (!container) return;
    container.addEventListener('click', e=>{
      const btn = e.target.closest('.chip');
      if(!btn) return;
      [...container.querySelectorAll('.chip')].forEach(c=>c.classList.remove('active'));
      btn.classList.add('active');
      state[key] = btn.dataset[key] || '';
      applyFilters();
    });
    const first = container.querySelector('.chip');
    if(first){ first.classList.add('active'); }
  }
  wireChips(chipReset,'reset');
  wireChips(chipCon,'con');



const data = [
  {
    id:'rt-ac1200',
    fabricante:'Independente',
    modelo:'RT-AC1200',
    categoria:'Roteadores',
    conectividade:['wifi','cabo'],
    reset:['botao','interface','padrao'],
    resumo:'Roteador AC1200 dual-band com WPS e QoS.',
    passos:[
      { t:'Reset físico (botão)', steps:[
        'Com o aparelho ligado, pressione o botão RESET por 10–12 segundos até o LED de status piscar.',
        'Solte o botão e aguarde o reinício completo (até 3 minutos).',
        'Após reiniciar, o IP retorna ao padrão e as credenciais voltam às de fábrica.'
      ]},
      { t:'Reset via interface', steps:[
        'Acesse o painel (ex.: http://192.168.0.1).',
        'Faça login com suas credenciais atuais.',
        'Vá em Administração → Backup/Reset → Restaurar padrões.',
        'Confirme e aguarde o reinício.'
      ]}
    ],
    infos:[ ['IP padrão','192.168.0.1'], ['Usuário padrão','admin'], ['Senha padrão','admin'] ],
    observacoes:'Se o WPS estiver ativo, desative antes do reset via interface para evitar reconexões automáticas.',
    referencias:[ { rotulo:'Manual oficial (exemplo)', url:'#' } ]
  },

  {
    id:'nvr-8ch',
    fabricante:'Independente',
    modelo:'NVR-8CH',
    categoria:'CFTV (câmeras/DVR/NVR)',
    conectividade:['cabo','poe'],
    reset:['interface','padrao'],
    resumo:'Gravador de vídeo em rede para até 8 canais com PoE integrado.',
    passos:[
      { t:'Restaurar padrões (interface)', steps:[
        'Conecte monitor e mouse ao NVR.',
        'Entre em Configurações → Sistema → Manutenção.',
        'Clique em “Restaurar padrões de fábrica” e confirme.',
        'O NVR reiniciará com as configurações originais.'
      ]}
    ],
    infos:[ ['IP padrão','192.168.1.108'], ['Usuário padrão','admin'] ],
    observacoes:'Alguns modelos exigem senha temporária/segurança gráfica; verifique o manual específico para recuperação de senha.',
    referencias:[ { rotulo:'Guia do fabricante (exemplo)', url:'#' } ]
  },

  {
    id:'acesso-biometrico',
    fabricante:'Independente',
    modelo:'AC-Bio100',
    categoria:'Controle de Acesso',
    conectividade:['cabo'],
    reset:['interface','padrao'],
    resumo:'Controlador biométrico com teclado e relé para fechadura elétrica.',
    passos:[
      { t:'Reset via menu local', steps:[
        'No teclado, entre em Menu → Sistema → Restaurar padrões.',
        'Informe a senha de administrador.',
        'Confirme a restauração e aguarde o reinício.'
      ]},
      { t:'Reset por comando', steps:[
        'Conecte via software de gestão na mesma sub-rede.',
        'Envie o comando de restauração (verificar porta e protocolo no manual específico).'
      ]}
    ],
    infos:[ ['Tensão','12 VDC'], ['Contato de relé','NA/NF 3A'] ],
    observacoes:'Faça backup de digitais e usuários antes da restauração.',
    referencias:[ { rotulo:'Manual técnico (exemplo)', url:'#' } ]
  },

  // ==== Intelbras (convertidos para o esquema do site) ====

  {
    id:'intelbras-nvd-1208',
    fabricante:'Independente',
    modelo:'Intelbras NVD 1208',
    categoria:'CFTV (câmeras/DVR/NVR)',
    conectividade:['cabo'],
    reset:['interface','padrao'],
    resumo:'NVR para câmeras IP, gerenciamento e gravação em rede.',
    passos:[
      { t:'Restaurar padrões pela interface', steps:[
        'Acesse o menu do NVR com monitor e mouse conectados.',
        'Vá em Sistema → Manutenção/Restaurar padrões.',
        'Selecione o que deseja restaurar e confirme o reinício.'
      ]},
      { t:'Configuração de rede (DHCP ou IP fixo)', steps:[
        'Em Rede, mantenha DHCP para IP automático ou defina IP estático conforme sua rede.',
        'Aplicar e reiniciar se solicitado.'
      ]}
    ],
    infos:[ ['IP padrão','DHCP (automático)'], ['Usuário padrão','admin'], ['Senha padrão','admin'] ],
    observacoes:'Adicionar câmeras: Disp. remoto → Procurar → Adicionar. Troque a senha no primeiro acesso.',
    referencias:[ { rotulo:'Manual oficial', url:'https://backend.intelbras.com/sites/default/files/2020-06/Manual-do-usuario-NVD-1204-NVD-1208-NVD-1216-02.20.pdf' } ]
  },

  {
    id:'intelbras-vip-1120-b-g2',
    fabricante:'Independente',
    modelo:'Intelbras VIP 1120 B G2',
    categoria:'CFTV (câmeras/DVR/NVR)',
    conectividade:['cabo'],
    reset:['interface','padrao'],
    resumo:'Câmera IP bullet 1 MP para uso residencial/comercial.',
    passos:[
      { t:'Restaurar padrões (interface web)', steps:[
        'Acesse a interface da câmera pelo navegador.',
        'Entre em Sistema/Manutenção.',
        'Clique em “Restaurar padrões de fábrica” e confirme.'
      ]},
      { t:'Encontrar o IP da câmera', steps:[
        'Com DHCP, a câmera recebe IP automaticamente.',
        'Sem DHCP, usar IP padrão ou ferramenta de descoberta (IP Utility/SIM Plus).'
      ]}
    ],
    infos:[ ['IP padrão','192.168.1.108'], ['Usuário padrão','admin'], ['Senha padrão','admin'] ],
    observacoes:'Alguns firmwares antigos pedem navegador legado; use a ferramenta de descoberta se não souber o IP.',
    referencias:[ { rotulo:'Manual oficial', url:'https://backend.intelbras.com/sites/default/files/2020-07/Manual-do-usuario-vip-1120-b-g2-vip-1120-d-g2.pdf' } ]
  },

  {
    id:'intelbras-fr-220',
    fabricante:'Independente',
    modelo:'Intelbras FR 220',
    categoria:'Controle de Acesso',
    conectividade:[],
    reset:['padrao'],
    resumo:'Fechadura digital de sobrepor com senha/biometria.',
    passos:[
      { t:'Reiniciar (sem apagar cadastros)', steps:[
        'Pressione o botão de reset até ouvir o bip.',
        'Aguarde a reinicialização e teste o teclado.'
      ]},
      { t:'Retorno ao padrão de fábrica', steps:[
        'Siga o procedimento do manual/suporte; após isso, recadastre usuários.',
        'Altere a senha padrão imediatamente.'
      ]}
    ],
    infos:[ ['Senha padrão','1234'], ['Emergência','Bateria 9V nos contatos externos'] ],
    observacoes:'Função “Não perturbe” bloqueia aberturas externas.',
    referencias:[ { rotulo:'Manual oficial', url:'https://backend.intelbras.com/sites/default/files/2025-01/Manual_usuario_FR_220_03-24_site.pdf' } ]
  },

  {
    id:'intelbras-twibi-giga',
    fabricante:'Independente',
    modelo:'Intelbras Twibi Giga',
    categoria:'Roteadores',
    conectividade:['wifi','cabo'],
    reset:['interface','padrao'],
    resumo:'Sistema Wi-Fi mesh AC1200 para ampliar cobertura.',
    passos:[
      { t:'Configuração inicial pelo app', steps:[
        'Conecte à rede inicial do Twibi.',
        'Abra o app de gerenciamento e siga o assistente para criar a rede.',
        'Defina SSID e senha e finalize.'
      ]},
      { t:'Restaurar padrões pelo app', steps:[
        'No app, acesse Manutenção/Restaurar padrões.',
        'Confirme e aguarde o reinício do nó.'
      ]}
    ],
    infos:[ ['Modos','DHCP, PPPoE, IP estático, AP (bridge)'] ],
    observacoes:'Recomendado até ~6 nós por rede, conforme cenário.',
    referencias:[ { rotulo:'Manual oficial', url:'https://backend.intelbras.com/sites/default/files/2022-12/Manual_Twibi_GIGA_portugues_06-22_0.pdf' } ]
  },

  {
  id:'intelbras-mhdx-1016-c',
  fabricante:'Independente',
  modelo:'Intelbras MHDX 1016-C',
  categoria:'CFTV (câmeras/DVR/NVR)',
  conectividade:['cabo'],
  reset:['interface','padrao'],
  resumo:'DVR multitecnologia (16 canais) com H.265+/análises inteligentes e suporte a IP.',
  passos:[
    { t:'Restaurar padrões (menu do DVR)', steps:[
      'Acesse o menu principal com monitor/mouse.',
      'Vá em Sistema → Manutenção → Restaurar padrões.',
      'Selecione os itens desejados e confirme; o DVR reinicia.'
    ]},
    { t:'Rede (DHCP/IP estático)', steps:[
      'Em Rede, mantenha DHCP para IP automático ou defina IP estático.',
      'Confirme e reinicie se necessário.'
    ]}
  ],
  infos:[ ['IP','DHCP por padrão (configurável)'], ['Usuário','admin'], ['Senha','definida no 1º acesso (firmwares novos)'] ],
  observacoes:'Modelos “-C” suportam câmeras IP até 6 MP (ver detalhes no manual por série).',
  referencias:[
    { rotulo:'Manual MHDX 1004/1008/1016-C', url:'https://backend.intelbras.com/sites/default/files/2022-08/Manual_MHDX_1004_1008_1016C_01-22_site.pdf' },
    { rotulo:'Página MHDX 1016-C (visão geral)', url:'https://www.intelbras.com/en/1000-series-video-recorder-with-16-channels-mhdx-1016-c' }
  ]
},

{
  id:'intelbras-vip-3230',
  fabricante:'Independente',
  modelo:'Intelbras VIP 3230 (família SL/VF/W)',
  categoria:'CFTV (câmeras/DVR/NVR)',
  conectividade:['cabo','wifi'],
  reset:['interface','padrao'],
  resumo:'Câmera IP (variações bullet/dome/wi-fi) com dois streams e configuração via web.',
  passos:[
    { t:'Restaurar padrões (interface web)', steps:[
      'Acesse a câmera pelo navegador (IP atual).',
      'Entre em Sistema/Manutenção → Restaurar padrões de fábrica.',
      'Confirme e aguarde o reboot.'
    ]},
    { t:'Descobrir IP da câmera', steps:[
      'Com DHCP ativo, a câmera recebe IP automaticamente (use IP Utility/UPnP).',
      'Sem DHCP, utilize o IP padrão ou defina IP estático conforme a rede.'
    ]}
  ],
  infos:[ ['IP típico sem DHCP','192.168.1.108'], ['Usuário padrão','admin'], ['Senha padrão','admin (alterar)'] ],
  observacoes:'Modelos Wi-Fi (W) têm procedimento de pareamento próprio; ver manual da variante (SL/VF/W).',
  referencias:[
    { rotulo:'Manual VIP 3230 SL/D SL', url:'https://backend.intelbras.com/sites/default/files/2020-10/Manual-do-usuario-VIP-3230-B-SL-VIP-3230-D-SL-02.20.pdf' },
    { rotulo:'Manual VIP 3230/1130 VF G2', url:'https://backend.intelbras.com/sites/default/files/2020-12/Manual_VIP_3230_1130_1130D_VF_G2_02-20_site_0.pdf' },
    { rotulo:'Manual VIP 3230 W/3430 W', url:'https://backend.intelbras.com/sites/default/files/2020-10/Manual-do-usuario-VIP-3230-W-VIP-3230-D-W-VIP-3430-W-E-VIP-3430-D-W-V2.pdf' }
  ]
},

{
  id:'intelbras-iv-7010-hf-hd',
  fabricante:'Independente',
  modelo:'Intelbras IV 7010 HF HD',
  categoria:'Interfonia',
  conectividade:['cabo'],
  reset:['interface','padrao'],
  resumo:'Videoporteiro com módulo interno 7” (até 4 canais de vídeo) e recursos de segurança.',
  passos:[
    { t:'Restaurar ajustes de fábrica (menu)', steps:[
      'No módulo interno, acesse o menu de configurações.',
      'Localize a opção de restauração/padrões de fábrica.',
      'Confirme e aguarde o reinício do sistema.'
    ]},
    { t:'Configurações básicas', steps:[
      'Ajuste brilho/áudio/data/hora no menu.',
      'Faça o pareamento/ligação com a unidade externa conforme diagrama do manual.'
    ]}
  ],
  infos:[ ['Tela','7” TFT-LCD'], ['Canais de vídeo','até 4'] ],
  observacoes:'Ver variantes (ME/HD) para diferenças de recursos e ligações.',
  referencias:[
    { rotulo:'Manual IV 7010 HF (PT)', url:'https://backend.intelbras.com/sites/default/files/2020-11/Manual_IV%207010%20HF_portugues_02-20.pdf' },
    { rotulo:'Manual IV 7010 HF HD (PT)', url:'https://backend.intelbras.com/sites/default/files/2021-05/manual-do-usuario-iv-7010-me-hd.pdf' }
  ]
},

{
  id:'intelbras-twibi-force-ax',
  fabricante:'Independente',
  modelo:'Intelbras Twibi Force AX',
  categoria:'Roteadores',
  conectividade:['wifi','cabo'],
  reset:['interface','padrao'],
  resumo:'Sistema Wi-Fi 6 (mesh) com app de gerenciamento e modos roteador/repetidor/AP.',
  passos:[
    { t:'Configuração/gestão pelo app', steps:[
      'Conecte-se à rede inicial do Twibi.',
      'Abra o app Wi-Fi Control Home e siga o assistente para criar SSID e senha.',
      'Use o app para manutenção (reinício, atualizações, etc.).'
    ]},
    { t:'Reset/reconfiguração', steps:[
      'Pelo app: acesse manutenção/restauração e confirme.',
      'Para reset físico (quando aplicável), siga o manual completo do modelo.'
    ]}
  ],
  infos:[ ['Wi-Fi','802.11ax (Wi-Fi 6)'], ['Modos','Roteador, Repetidor, AP (bridge)'] ],
  observacoes:'Para adicionar novos nós, posicione até ~10 m do nó ativo e use o app.',
  referencias:[
    { rotulo:'Guia de instalação Twibi Force AX', url:'https://backend.intelbras.com/sites/default/files/2023-05/guia-de-instalacao-twibi-force-ax-pt.pdf' },
    { rotulo:'Página do produto', url:'https://www.intelbras.com/pt-br/roteador-mesh-ax-1500-twibi-force-ax' }
  ]
},

{
  id:'intelbras-xpe-1013-plus',
  fabricante:'Independente',
  modelo:'Intelbras XPE 1013 (linha Plus/IP)',
  categoria:'Interfonia',
  conectividade:['cabo'],
  reset:['interface','padrao'],
  resumo:'Porteiro eletrônico (variações Plus/IP) com viva-voz, abertura de fechadura e programação.',
  passos:[
    { t:'Retornar padrões (programação)', steps:[
      'Entre no modo de programação local conforme o manual.',
      'Aplique o comando/menus de restauração para padrões de fábrica.',
      'Reinicie e recadastre senhas/endereços conforme necessidade.'
    ]},
    { t:'Ligação/telefone/PABX', steps:[
      'Conecte ao ramal/linha/PABX conforme diagrama de instalação.',
      'Teste a discagem e a abertura da fechadura.'
    ]}
  ],
  infos:[ ['Integração','PABX/centrais/FXS (varia por versão)'], ['Opções','senha, RFID (modelos ID), botoneira'] ],
  observacoes:'Verifique se o seu é “Plus”, “IP” ou “Plus ID” — comandos e recursos mudam por variante.',
  referencias:[
    { rotulo:'Manual XPE 1001/1013 IP', url:'https://backend.intelbras.com/sites/default/files/2020-11/Manual_XPE_1000_1013_IP_portugues_03-20_site.pdf' },
    { rotulo:'Manual XPE 1001/1013 Plus', url:'https://backend.intelbras.com/sites/default/files/2022-04/Manual_XPE_1001_1013_PLUS_01-22_site.pdf' }
  ]
},

{
  id:'intelbras-vip-1220-fc-plus',
  fabricante:'Independente',
  modelo:'Intelbras VIP 1220 FC+ / VIP 1220 D FC+',
  categoria:'CFTV (câmeras/DVR/NVR)',
  conectividade:['cabo','poe'],
  reset:['botao','interface','padrao'],
  resumo:'Câmera IP Full Color (1 MP) com alimentação 12 Vdc ou PoE.',
  passos:[
    { t:'Reset físico (botão)', steps:[
      'Com a câmera ligada, mantenha o botão de reset pressionado por ~10–12 s até indicar reinício.',
      'Solte e aguarde o reboot; parâmetros voltam ao padrão.'
    ]},
    { t:'Restaurar padrões (interface web)', steps:[
      'Acesse a câmera pelo navegador.',
      'Vá em Sistema/Manutenção → Restaurar padrões de fábrica.',
      'Confirme e aguarde o reinício.'
    ]}
  ],
  infos:[ ['IP padrão (sem DHCP)','192.168.1.108'], ['Usuário','admin'], ['Senha','definida no 1º acesso'] ],
  observacoes:'Localize via IP Utility/SIM Plus quando estiver em DHCP.',
  referencias:[ { rotulo:'Manual oficial (VIP 1220 FC+)', url:'#' } ]
},
{
  id:'intelbras-mhdx-1008-c',
  fabricante:'Independente',
  modelo:'Intelbras MHDX 1008-C',
  categoria:'CFTV (câmeras/DVR/NVR)',
  conectividade:['cabo'],
  reset:['interface','padrao'],
  resumo:'DVR Multi-HD (8 canais) com menu local para manutenção.',
  passos:[
    { t:'Restaurar padrões (menu do DVR)', steps:[
      'Conecte monitor e mouse.',
      'Menu principal → Sistema → Manutenção → Restaurar padrões.',
      'Selecione os itens desejados e confirme; o DVR reinicia.'
    ]},
    { t:'Rede (DHCP/IP estático)', steps:[
      'Em Rede, use DHCP para IP automático ou defina IP estático.',
      'Aplicar alterações e reiniciar se solicitado.'
    ]}
  ],
  infos:[ ['IP','DHCP por padrão'], ['Usuário','admin'], ['Senha','definida no 1º acesso (firmwares novos)'] ],
  observacoes:'Verifique compatibilidade de câmeras por canal e bitrate no manual.',
  referencias:[ { rotulo:'Manual oficial (MHDX 1004/1008/1016-C)', url:'#' } ]
},
{
  id:'intelbras-nvd-1308',
  fabricante:'Independente',
  modelo:'Intelbras NVD 1308',
  categoria:'CFTV (câmeras/DVR/NVR)',
  conectividade:['cabo'],
  reset:['interface','padrao'],
  resumo:'NVR de 8 canais para câmeras IP, com configuração local.',
  passos:[
    { t:'Restaurar padrões (interface local)', steps:[
      'Conecte monitor e mouse ao NVR.',
      'Sistema → Manutenção → Restaurar padrões de fábrica.',
      'Confirme e aguarde o reinício.'
    ]},
    { t:'Ajuste de rede', steps:[
      'Em Rede, mantenha DHCP para IP automático ou configure IP estático.',
      'Salvar e reiniciar se necessário.'
    ]}
  ],
  infos:[ ['IP','DHCP por padrão'], ['Usuário','admin'], ['Senha','definida/trocada no 1º acesso'] ],
  observacoes:'Adicionar câmeras: Dispositivo remoto → Procurar → Adicionar.',
  referencias:[ { rotulo:'Página/Manual oficial (NVD 1308)', url:'#' } ]
},
{
  id:'intelbras-twibi-ax',
  fabricante:'Independente',
  modelo:'Intelbras Twibi AX (Wi-Fi 6)',
  categoria:'Roteadores',
  conectividade:['wifi','cabo'],
  reset:['interface','padrao'],
  resumo:'Sistema Wi-Fi mesh (802.11ax) com gerenciamento por app.',
  passos:[
    { t:'Configuração inicial (app)', steps:[
      'Conecte-se à rede inicial do Twibi.',
      'Abra o app de gerenciamento e siga o assistente para criar SSID/senha.',
      'Finalize e teste a internet.'
    ]},
    { t:'Restaurar padrões (app)', steps:[
      'No app, acesse manutenção/restauração.',
      'Confirme e aguarde o reinício.'
    ]}
  ],
  infos:[ ['Modos','Roteador, Repetidor, AP (bridge)'] ],
  observacoes:'Para adicionar novos nós, aproxime do nó principal e use o app.',
  referencias:[ { rotulo:'Guia/Manual Twibi AX', url:'#' } ]
},
{
  id:'intelbras-action-rg-1200',
  fabricante:'Independente',
  modelo:'Intelbras ACtion RG 1200',
  categoria:'Roteadores',
  conectividade:['wifi','cabo'],
  reset:['botao','interface','padrao'],
  resumo:'Roteador AC1200 com acesso via meuintelbras.local e botão RST/WPS.',
  passos:[
    { t:'Reset físico (RST/WPS)', steps:[
      'Com o roteador ligado, pressione o botão RST/WPS por ~15–20 s.',
      'Solte ao ver os LEDs indicarem reinício; aguarde aplicar padrões.'
    ]},
    { t:'Restaurar padrões (web)', steps:[
      'Acesse http://meuintelbras.local (ou IP atual).',
      'Sistema → Backup & Restore → Restaurar padrões.',
      'Confirme e aguarde.'
    ]}
  ],
  infos:[ ['Acesso rápido','http://meuintelbras.local'], ['Usuário','admin'], ['Senha','definida no assistente inicial'] ],
  observacoes:'Possui WPS (mesmo botão do reset).',
  referencias:[ { rotulo:'Manual oficial (ACtion RG 1200)', url:'#' } ]
},
{
  id:'intelbras-ss-420',
  fabricante:'Independente',
  modelo:'Intelbras SS 420',
  categoria:'Controle de Acesso',
  conectividade:['cabo'],
  reset:['interface','padrao'],
  resumo:'Controlador de acesso (cartão/biometria) com programação local.',
  passos:[
    { t:'Limpeza/restauração de usuários', steps:[
      'Entre no modo de programação local conforme o manual.',
      'Aplique o comando de limpeza/restore indicado.',
      'Confirme e aguarde a finalização.'
    ]},
    { t:'Retorno a padrões do sistema', steps:[
      'No menu local, acesse a opção de “padrões de fábrica”.',
      'Confirme e recadastre administradores/usuários.'
    ]}
  ],
  infos:[ ['Alimentação','12 Vdc'], ['Relé','NA/NF (consultar corrente máx.)'] ],
  observacoes:'Faça backup de usuários/biometrias antes de restaurar.',
  referencias:[ { rotulo:'Manual oficial (SS 420)', url:'#' } ]
},
{
  id:'intelbras-fr-320',
  fabricante:'Independente',
  modelo:'Intelbras FR 320',
  categoria:'Controle de Acesso',
  conectividade:[],
  reset:['padrao'],
  resumo:'Fechadura digital de sobrepor com senha/biometria e entrada de emergência 9V.',
  passos:[
    { t:'Reiniciar produto (sem apagar cadastros)', steps:[
      'Pressione o botão de reset até o aviso sonoro/luminoso.',
      'Aguarde a reinicialização e teste o teclado.'
    ]},
    { t:'Retorno aos padrões de fábrica', steps:[
      'Siga a sequência indicada no manual (apaga todos os cadastros).',
      'Após o processo, recadastre senhas/biometrias.'
    ]}
  ],
  infos:[ ['Emergência','Bateria 9 V nos contatos externos'], ['Instalação','Sobrepor (porta)'] ],
  observacoes:'Troque senhas padrão imediatamente após a instalação.',
  referencias:[ { rotulo:'Manual oficial (FR 320)', url:'#' } ]
},
{
  id:'intelbras-iv-4010-hs',
  fabricante:'Independente',
  modelo:'Intelbras IV 4010 HS',
  categoria:'Interfonia',
  conectividade:['cabo'],
  reset:['interface','padrao'],
  resumo:'Videoporteiro com módulo interno e unidade externa; ajustes pelo menu.',
  passos:[
    { t:'Restaurar ajustes (menu)', steps:[
      'No módulo interno, acesse configurações.',
      'Selecione restauração/padrões de fábrica e confirme.',
      'O sistema reinicia com valores padrão.'
    ]},
    { t:'Ajustes básicos', steps:[
      'Configure data/hora, volume e brilho.',
      'Faça a ligação correta com a unidade externa e (se houver) câmeras extras.'
    ]}
  ],
  infos:[ ['Canais de vídeo','conforme variante'], ['Tela','consultar variante (polegadas)'] ],
  observacoes:'Verificar diferenças entre versões HS/HF/HD.',
  referencias:[ { rotulo:'Manual oficial (IV 4010 HS)', url:'#' } ]
},
{
  id:'intelbras-sg-2404-poe-l2-plus',
  fabricante:'Independente',
  modelo:'Intelbras SG 2404 PoE L2+',
  categoria:'Rede (switch/PoE)',
  conectividade:['cabo','poe'],
  reset:['interface','padrao'],
  resumo:'Switch gerenciável L2+ com múltiplas portas PoE e interface web.',
  passos:[
    { t:'Acesso e restauração (web)', steps:[
      'Conecte um PC à VLAN padrão.',
      'Acesse o IP do switch → Sistema/Ferramentas → Restaurar padrão.',
      'Confirme e aguarde o reboot.'
    ]},
    { t:'Ajuste de IP/Gateway', steps:[
      'Em Funções L3 → Interface, ajuste IP da VLAN 1 e gateway.',
      'Salve as configurações para não perder após reinício.'
    ]}
  ],
  infos:[ ['IP padrão','192.168.0.1'], ['Usuário','admin'], ['Senha','admin'] ],
  observacoes:'Verifique o “PoE budget” para não exceder a potência por porta/conjunto.',
  referencias:[ { rotulo:'Manual oficial (SG 2404 PoE L2+)', url:'#' } ]
},
{
  id:'intelbras-ata-200',
  fabricante:'Independente',
  modelo:'Intelbras ATA 200 (VoIP)',
  categoria:'Telefonia/VoIP',
  conectividade:['cabo'],
  reset:['botao','interface','padrao'],
  resumo:'Adaptador telefônico analógico (ATA) para uso com contas SIP.',
  passos:[
    { t:'Reset físico (botão)', steps:[
      'Com o ATA ligado, mantenha o botão de reset pressionado ~10 s.',
      'Aguarde o reinício e retorno aos padrões.'
    ]},
    { t:'Restaurar padrões (web)', steps:[
      'Descubra o IP do ATA (DHCP) e acesse via navegador.',
      'Administração → Restaurar/Factory default → Confirmar.',
      'Após reboot, reconfigure a conta SIP.'
    ]}
  ],
  infos:[ ['IP','via DHCP (descobrir no roteador)'], ['Usuário','admin'], ['Senha','admin (trocar)'] ],
  observacoes:'Após reset, reconfigure SIP (servidor, usuário, senha) e codecs.',
  referencias:[ { rotulo:'Manual oficial (ATA 200)', url:'#' } ]
},

{
  id:'ss-3430-bio',
  fabricante:'Intelbras',
  modelo:'SS 3430 BIO / SS 3430 MF BIO',
  categoria:'Controle de Acesso',
  conectividade:['cabo','ethernet','wiegand','rs485','(wifi em alguns lotes)'],
  reset:['interface','padrao'],
  resumo:'Controlador touch com senha, biometria e RFID (125 kHz no BIO / 13,56 MHz no MF BIO). Integra InControl; versão MF integra MIP 1000 IP.',
  passos:[
    { t:'Restaurar padrões (interface)', steps:[
      'No visor: Menu → Sistema → **Restaurar padrão**.',
      'Confirme e aguarde reiniciar.'
    ]},
    { t:'Reiniciar (sem apagar dados)', steps:[
      'Menu → Sistema → **Reiniciar**.'
    ]}
  ],
  infos:[
    ['RFID','125 kHz (BIO) / 13,56 MHz (MF BIO)'],
    ['Tela','3” touch'],
    ['Integração','InControl (Ethernet); MIP 1000 IP (apenas MF BIO)']
  ],
  observacoes:'Na primeira inicialização é exigido cadastro do administrador (defina senha e e-mail).',
  referencias:[
    { rotulo:'Manual SS 3430 BIO/MF BIO', url:'https://backend.intelbras.com/sites/default/files/2025-07/Manual_SS_3430_BIO_MF_bilingue_03-25_site.pdf' },
    { rotulo:'Manual da Interface Web (Bio-T)', url:'https://manuais.intelbras.com.br/manual-interface-web-linha-bio-t/pt-BR/manual_SS3430_BIO_pt-BR.html' }
  ]
},

{
  id:'ss-3532-3542-mf-w',
  fabricante:'Intelbras',
  modelo:'SS 3532 MF W / SS 3542 MF W',
  categoria:'Controle de Acesso (facial)',
  conectividade:['cabo','ethernet','rs485','wiegand'],
  reset:['interface','padrao'],
  resumo:'Controladores com reconhecimento facial (SS 3542 MF W também tem biometria digital).',
  passos:[
    { t:'Restaurar padrões (interface)', steps:[
      'Menu → Sistema → **Padrão/Restaurar padrão**.',
      'Confirme (Ok) e aguarde reinício.'
    ]},
    { t:'Reiniciar dispositivo', steps:[
      'Menu → Sistema → **Reiniciar**.'
    ]}
  ],
  infos:[
    ['Tela','4,3” touch'],
    ['Modos','Senha / Cartão 13,56 MHz / Face (e biometria no 3542)'],
    ['Integração','Conexões TCP/IP, RS-485, Wiegand']
  ],
  observacoes:'Ao restaurar padrão, revise parâmetros de rede (TCP/IP) antes de reconectar ao software.',
  referencias:[
    { rotulo:'Manual SS 3532/3542 MF W', url:'https://backend.intelbras.com/sites/default/files/2023-11/manual-do-usuario-ss-3532-mf-w-ss-3542-mf-w-pt.pdf' },
    { rotulo:'Interface Web (Bio-T) – 3532/3542', url:'https://manuais.intelbras.com.br/manual-interface-web-linha-bio-t/pt-BR/manual_SS3532_SS3542_MFW_pt-BR.html' }
  ]
},

{
  id:'ss-320',
  fabricante:'Intelbras',
  modelo:'SS 320 / SS 320 MF',
  categoria:'Controle de Acesso',
  conectividade:['cabo','ethernet','wiegand'],
  reset:['magnetico','padrao'],
  resumo:'Controlador com cartão (e biometria no SS 320 MF). Possui IP padrão e reset físico por sensor magnético.',
  passos:[
    { t:'Reset configurações p/ padrão de fábrica (sem apagar usuários)', steps:[
      'Desligue o equipamento e solte do suporte.',
      'Religue mantendo o **ímã/sensor** fechado; após entrar em verificação, afaste (abrir) o sensor e aguarde ~30 s (bipe).',
      'Aproxime/afaste o suporte **3 vezes** (bipes a cada aproximação).',
      'Reinicie. O IP volta ao **192.168.1.201** e o admin atual perde a permissão (vira comum).'
    ]}
  ],
  infos:[
    ['IP padrão','192.168.1.201'],
    ['Software','SoapAdmin 3.5'],
    ['Eventos','até 100.000']
  ],
  observacoes:'O reset de fábrica não exclui usuários. Para apagar todos os usuários, use o software.',
  referencias:[
    { rotulo:'Manual SS 320/SS 320 MF', url:'https://backend.intelbras.com/sites/default/files/2023-01/Manual_SS_320_portugues_01-22_site.pdf' }
  ]
},

{
  id:'ss-610',
  fabricante:'Intelbras',
  modelo:'SS 610',
  categoria:'Controle de Acesso',
  conectividade:['cabo','ethernet','wiegand'],
  reset:['interface','padrao'],
  resumo:'Controlador com senha/biometria/cartão e integração SoapAdmin 3.5.',
  passos:[
    { t:'Resetar (configurações de fábrica)', steps:[
      'Menu do sistema → **Resetar / Reset configurações de fábrica**.',
      'Confirme. (Não apaga usuários, data e hora.)'
    ]},
    { t:'Reset configurações de acesso (porta)', steps:[
      'Menu → Configurações de acesso → **Reset** para padrões de fábrica das regras de porta.'
    ]}
  ],
  infos:[
    ['Eventos','até 100.000'],
    ['Integração','SoapAdmin 3.5 (Ethernet)']
  ],
  observacoes:'Se precisar apagar usuários, faça pelo software e sincronize com o equipamento.',
  referencias:[
    { rotulo:'Manual SS 610', url:'https://backend.intelbras.com/sites/default/files/2019-03/manual-do-usuario-ss-610.pdf' }
  ]
},

{
  id:'ss-3710-uhf',
  fabricante:'Intelbras',
  modelo:'SS 3710 UHF',
  categoria:'Controle de Acesso (veicular UHF)',
  conectividade:['cabo','ethernet','rs485','wiegand','poe'],
  reset:['botao','padrao'],
  resumo:'Controlador/Leitor UHF IP66 para acesso veicular; configuração via Ethernet; integra InControl/Defense IA.',
  passos:[
    { t:'Reset parcial (configurações)', steps:[
      'Com o dispositivo ligado, remova a tampinha do **botão de reset**.',
      'Pressione o botão por **~5 s** (primeiro aviso sonoro).'
    ]},
    { t:'Reset total (fábrica)', steps:[
      'Pressione e segure o botão por **~15 s** até o **segundo** aviso sonoro.',
      'Solte e aguarde reinício.'
    ]}
  ],
  infos:[
    ['Frequência','902–928 MHz (UHF)'],
    ['Grau de proteção','IP66'],
    ['Distância típica','até ~10 m']
  ],
  observacoes:'Após reset total, reconfigure rede/portas e vinculação ao software.',
  referencias:[
    { rotulo:'Manual SS 3710 UHF', url:'https://backend.intelbras.com/sites/default/files/2025-07/Manual_SS_3710_UHF_01-25_site%20(1).pdf' }
  ]
},

{
  id:'fr-201',
  fabricante:'Intelbras',
  modelo:'FR 201',
  categoria:'Fechadura Digital (Controle de Acesso)',
  conectividade:['standalone'],
  reset:['botao','padrao'],
  resumo:'Fechadura de sobrepor com senha e TAG. Alimentada por 4 pilhas AA.',
  passos:[
    { t:'Reiniciar produto (sem apagar cadastros)', steps:[
      'Pressione o **botão de reset** na unidade interna.',
      'Teclado pisca e bip confirma; a fechadura volta a responder.'
    ]},
    { t:'Retorno ao padrão de fábrica', steps:[
      'Disponível **somente via Suporte Intelbras**.',
      'Atenção: redefine a senha de acesso para **1234** e apaga configurações/cadastros.'
    ]},
    { t:'Acesso de emergência', steps:[
      'Encoste uma **bateria 9 V** nos contatos externos e faça a abertura normalmente.'
    ]}
  ],
  infos:[
    ['Alimentação','4× pilhas AA (6 V)'],
    ['Identificação','Senha (4–12 díg.) e TAG MIFARE'],
    ['Funções','Não perturbe, travamento automático']
  ],
  observacoes:'Não recomendada para áreas externas expostas a chuva/sol.',
  referencias:[
    { rotulo:'Manual FR 201 (02/2024)', url:'https://backend.intelbras.com/sites/default/files/2025-01/Manual_FR_201_02-24_site.pdf' }
  ]
},

{
  id:'fr-620',
  fabricante:'Intelbras',
  modelo:'FR 620 (Push&Pull)',
  categoria:'Fechadura Digital (Controle de Acesso)',
  conectividade:['standalone'],
  reset:['botao'],
  resumo:'Fechadura de embutir com senha e TAG; maçaneta push&pull.',
  passos:[
    { t:'Reset (reinício do produto)', steps:[
      'Pressione o **botão de reset**; o teclado acende/apaga com bip de confirmação.',
      'Não apaga cadastros/configurações.'
    ]},
    { t:'Acesso de emergência', steps:[
      'Use **bateria 9 V** nos contatos externos e realize a abertura normalmente.'
    ]}
  ],
  infos:[
    ['Alimentação','4× pilhas AA'],
    ['Métodos','Senha (4–12 díg.) e TAG'],
    ['Funções','Não perturbe, travamento automático']
  ],
  observacoes:'Manual não descreve “fábrica” completo; para retorno total, consultar o suporte.',
  referencias:[
    { rotulo:'Manual FR 620', url:'https://backend.intelbras.com/sites/default/files/2019-08/Manual_usuario_FR_620_02-19.pdf' }
  ]
},

{
  id:'ss-411e',
  fabricante:'Intelbras',
  modelo:'SS 411E',
  categoria:'Controle de Acesso',
  conectividade:['cabo'],
  reset:['interface','tamper','padrao'],
  resumo:'Controlador stand-alone 125 kHz com suporte ao SoapAdmin 3.5.',
  passos:[
    { t:'Reset geral (interface)', steps:[
      'Acesse o menu → “Reset geral”.',
      'Escolha o que limpar (ex.: opções, eventos, dados) e confirme.',
      'O equipamento reinicia com os parâmetros escolhidos restaurados.'
    ]},
    { t:'Reset de IP e remoção de privilégios (tamper)', steps:[
      'Desligue o equipamento e solte do suporte (bracket).',
      'Religue mantendo-o encostado ao suporte; ao iniciar, afaste do suporte e aguarde ~30 s (alarme).',
      'Aproxime e afaste do suporte 3× (a cada aproximação há um bipe).',
      'Desligue e ligue novamente: o IP volta ao padrão e privilégios de admin são removidos.'
    ]}
  ],
  infos:[ ['IP padrão','192.168.1.201'] ],
  observacoes:'Gerenciamento e factory reset completo via SoapAdmin 3.5.',
  referencias:[
    { rotulo:'Manual SS 411E', url:'https://backend.intelbras.com/sites/default/files/2021-12/Manual_SS_411E_01-20_0.pdf' }
  ]
},

{
  id:'ss-3420-bio',
  fabricante:'Intelbras',
  modelo:'SS 3420 BIO / SS 3420 MF BIO',
  categoria:'Controle de Acesso',
  conectividade:['cabo','usb'],
  reset:['tamper','software','padrao'],
  resumo:'Controlador stand-alone com cartão e biometria; integração InControl Web.',
  passos:[
    { t:'Reset IP + senha de conexão + remover cartão-mestre (tamper)', steps:[
      'Desligue o equipamento e solte do suporte.',
      'Religue encostado ao suporte; quando inicializar, afaste do suporte e espere ~30 s até 2 bipes/LED vermelho.',
      'Aproxime/afaste do suporte 3× consecutivas (bipe a cada aproximação).',
      'Desligue/ligue de novo e fixe no suporte: IP e senha de conexão voltam ao padrão; cartão-mestre é removido.'
    ]},
    { t:'Restaurar padrões de fábrica (via software)', steps:[
      'Conecte ao InControl Web.',
      'Execute “Limpeza do dispositivo” para apagar usuários, eventos e resetar parâmetros.'
    ]}
  ],
  infos:[
    ['IP padrão','192.168.1.201'],
    ['Senha de conexão padrão','intelbras']
  ],
  observacoes:'Para recadastrar cartão-mestre, a lista de usuários deve estar vazia.',
  referencias:[
    { rotulo:'Manual SS 3420 (BIO/MF BIO)', url:'https://backend.intelbras.com/sites/default/files/2022-02/Manual_SS_3420_01-20.pdf' }
  ]
},

{
  id:'ss-420',
  fabricante:'Intelbras',
  modelo:'SS 420 / SS 420 MF',
  categoria:'Controle de Acesso',
  conectividade:['cabo','wiegand'],
  reset:['tamper','interface','padrao'],
  resumo:'Controlador stand-alone (125 kHz ou 13,56 MHz) com leitor auxiliar Wiegand.',
  passos:[
    { t:'Reset administrador (tamper)', steps:[
      'Desligue e solte do suporte.',
      'Religue com o botão tamper acionado; solte e aguarde ~30 s.',
      'Acesse o menu de programação e recadastre o admin.'
    ]},
    { t:'Apagar dados (interface)', steps:[
      'Menu → Sistema/Manutenção → “Apagar dados” (eventos) → confirme.',
      'Aguarde o reinício se solicitado.'
    ]}
  ],
  infos:[ ['IP padrão','192.168.1.201 (configurável)'] ],
  observacoes:'Integração com SoapAdmin 3.5 para gestão centralizada.',
  referencias:[
    { rotulo:'Manual SS 420/420 MF', url:'https://backend.intelbras.com/sites/default/files/2020-06/Manual_SS_420_SS_420_MF_01-20_0.pdf' }
  ]
},

{
  id:'ss-5532-mfw',
  fabricante:'Intelbras',
  modelo:'SS 5532 MF W (Bio-T)',
  categoria:'Controle de Acesso',
  conectividade:['cabo','wifi'],
  reset:['interface','padrao'],
  resumo:'Controlador facial com cartão 13,56 MHz, senha e rede Wi-Fi/Ethernet.',
  passos:[
    { t:'Restaurar padrões de fábrica (interface)', steps:[
      'Acesse a interface: Sistema → Padrões → “Restaurar padrões de fábrica”.',
      'Confirme; o equipamento reiniciará com as configurações de fábrica.'
    ]},
    { t:'Recuperação de senha de admin', steps:[
      'Utilize o e-mail cadastrado para recuperação na tela de login.'
    ]}
  ],
  infos:[
    ['Usuário admin','admin'],
    ['Senha','definida no primeiro uso / recuperável por e-mail']
  ],
  observacoes:'Modelos “W” possuem recursos de rede sem fio; ver compatibilidades no manual.',
  referencias:[
    { rotulo:'Manual SS 5532 MF W', url:'https://backend.intelbras.com/sites/default/files/2024-02/Manual_SS5532_MF_TW_bilingue_01-24_site.pdf' }
  ]
},

{
  id:'ss-311-mf',
  fabricante:'Intelbras',
  modelo:'Bio Inox Plus SS 311 MF / SS 311E',
  categoria:'Controle de Acesso',
  conectividade:['cabo','rs485','usb'],
  reset:['tamper','software','padrao'],
  resumo:'Controlador inox com biometria/cartão; SoapAdmin 3.5 e modo SCA 1000 (MIP 1000).',
  passos:[
    { t:'Reset de IP (padrão de fábrica)', steps:[
      'Desligue e solte do suporte.',
      'Ligue encostado ao suporte; quando iniciar, afaste do suporte e aguarde ~30 s.',
      'Aproxime o equipamento do suporte 3× consecutivas (bipe a cada aproximação).',
      'Reinicie: IP retorna ao padrão.'
    ]},
    { t:'Reset completo (factory reset)', steps:[
      'Somente via software SoapAdmin 3.5: adicione o dispositivo e execute a limpeza/restauração.'
    ]}
  ],
  infos:[ ['IP padrão','192.168.1.201'] ],
  observacoes:'Em modo SCA 1000 (MIP 1000), cadastros/gestão ficam no MIP; para sair, faça o reset de IP.',
  referencias:[
    { rotulo:'Manual Bio Inox Plus SS 311', url:'https://backend.intelbras.com/sites/default/files/2023-03/Manual_Bio_Inox_Plus_SS_311_MF_01-23_site.pdf' }
  ]
},

{
  id:'ibprox-ss120',
  fabricante:'Intelbras',
  modelo:'IBProx SS 120',
  categoria:'Controle de Acesso',
  conectividade:['cabo','wiegand','usb'],
  reset:['tamper','software','padrao'],
  resumo:'Controlador 125 kHz stand-alone com suporte a leitor auxiliar Wiegand.',
  passos:[
    { t:'Reset de IP (padrão 192.168.1.201)', steps:[
      'Desligue e retire do suporte.',
      'Ligue mantendo o botão tamper pressionado até iniciar; solte e aguarde ~30 s.',
      'Pressione o tamper 3× seguidas; bipe/LED verde confirmam.',
      'IP volta para 192.168.1.201.'
    ]},
    { t:'Reset completo (factory reset)', steps:[
      'Executado pelo SoapAdmin 3.5 (apaga usuários, registros e parâmetros).'
    ]}
  ],
  infos:[ ['IP padrão','192.168.1.201'] ],
  observacoes:'Sem botão físico de “factory reset”; use o software para restauração total.',
  referencias:[
    { rotulo:'Manual IBProx SS 120', url:'https://backend.intelbras.com/sites/default/files/2023-01/Manual_IBProx_SS_120_01-22_site.pdf' }
  ]
},

{
  id:'fr-220',
  fabricante:'Intelbras',
  modelo:'FR 220',
  categoria:'Controle de Acesso (Fechadura digital)',
  conectividade:['autônomo'],
  reset:['interface','suporte'],
  resumo:'Fechadura digital de sobrepor com senha e biometria.',
  passos:[
    { t:'Reinicialização simples', steps:[
      'Utilize o botão/combinação de reinício conforme o manual para reiniciar sem apagar cadastros (bipe/teclas indicam).'
    ]},
    { t:'Retorno aos padrões de fábrica', steps:[
      'Procedimento orientado oficialmente pelo suporte Intelbras (o manual não detalha a sequência completa).'
    ]}
  ],
  infos:[
    ['Energia','4× pilhas AA'],
    ['Emergência','Alimentação 9 V nos terminais externos']
  ],
  observacoes:'Após reset total, a senha volta ao padrão de fábrica; personalize imediatamente.',
  referencias:[
    { rotulo:'Manual do usuário FR 220 (2024/2025)', url:'https://backend.intelbras.com/sites/default/files/2025-01/Manual_usuario_FR_220_03-24_site.pdf' },
    { rotulo:'Página do produto', url:'https://www.intelbras.com/pt-br/fechadura-digital-com-biometria-fr-220' }
  ]
},

];

// Inicial
renderCards(data);
});
