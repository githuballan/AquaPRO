import os

svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <!-- Gradiente de Fundo Azul Água -->
    <radialGradient id="bgGradient" cx="40%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#48c6d4" />
      <stop offset="50%" stop-color="#22a3b5" />
      <stop offset="100%" stop-color="#126b78" />
    </radialGradient>

    <!-- Gradiente Metálico prateado/branco para a borda -->
    <linearGradient id="metalBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="30%" stop-color="#cfd8dc" />
      <stop offset="50%" stop-color="#ffffff" />
      <stop offset="70%" stop-color="#90a4ae" />
      <stop offset="100%" stop-color="#eceff1" />
    </linearGradient>

    <!-- Gradiente para os ícones e texto (efeito prateado/branco levemente reluzente) -->
    <linearGradient id="silverIcon" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e0e0e0" />
    </linearGradient>

    <!-- Sombra projetada leve -->
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="2" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.25"/>
    </filter>

    <filter id="badgeShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.15"/>
    </filter>

    <!-- Caminho do texto em arco circular -->
    <path id="textArc" d="M 95,250 A 155,155 0 0,0 405,250" fill="none"/>
  </defs>

  <style>
    .title-text {
      font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
      font-weight: 700;
      font-size: 34px;
      fill: url(#silverIcon);
      letter-spacing: 0.5px;
    }
    .sub-text {
      font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
      font-weight: 500;
      font-size: 19px;
      fill: #ffffff;
      letter-spacing: 1px;
    }
  </style>

  <!-- Círculo principal / Medalha -->
  <g filter="url(#badgeShadow)">
    <!-- Borda externa metálica -->
    <circle cx="250" cy="250" r="230" fill="url(#metalBorder)" />
    
    <!-- Anel interno de contraste -->
    <circle cx="250" cy="250" r="222" fill="#1b7b88" />
    
    <!-- Fundo do escudo com gradiente azul -->
    <circle cx="250" cy="250" r="218" fill="url(#bgGradient)" />

    <!-- Brilho superior (Efeito Vidro/Lente) -->
    <path d="M 42,210 A 218,218 0 0,1 458,210 A 218,140 0 0,0 42,210 Z" fill="#ffffff" opacity="0.15" />
  </g>

  <!-- Elementos Gráficos com Sombra -->
  <g filter="url(#dropShadow)">
    
    <!-- Título Principal "AquaristaPRO" -->
    <text x="250" y="145" text-anchor="middle" class="title-text">AquaristaPRO</text>

    <!-- Arcos Laterais Decorativos -->
    <path d="M 115,170 A 150,150 0 0,0 115,310" fill="none" stroke="url(#silverIcon)" stroke-width="5" stroke-linecap="round" />
    <path d="M 140,180 A 125,125 0 0,0 140,290" fill="none" stroke="url(#silverIcon)" stroke-width="4" stroke-linecap="round" />

    <path d="M 385,170 A 150,150 0 0,1 385,310" fill="none" stroke="url(#silverIcon)" stroke-width="5" stroke-linecap="round" />
    <path d="M 360,180 A 125,125 0 0,1 360,290" fill="none" stroke="url(#silverIcon)" stroke-width="4" stroke-linecap="round" />

    <!-- Ícone Central: Peixe e Plantas / Ondas -->
    <g transform="translate(0, 5)">
      <!-- Peixe -->
      <path d="M 180,245 
               C 210,210 270,210 320,245 
               C 335,230 350,220 360,215 
               L 350,245 L 360,275 
               C 350,270 335,260 320,245
               C 270,280 210,280 180,245 Z" 
            fill="none" stroke="url(#silverIcon)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
      
      <!-- Olho do Peixe -->
      <circle cx="305" cy="235" r="5" fill="url(#silverIcon)" />
      
      <!-- Nadadeira Superior -->
      <path d="M 245,218 C 255,195 275,195 285,221" fill="none" stroke="url(#silverIcon)" stroke-width="5" stroke-linecap="round"/>

      <!-- Folhas / Plantas Aquáticas -->
      <!-- Folha Central -->
      <path d="M 250,330 C 230,290 250,240 250,240 C 250,240 270,290 250,330 Z" fill="none" stroke="url(#silverIcon)" stroke-width="5" stroke-linejoin="round" />
      <path d="M 250,330 L 250,255" fill="none" stroke="url(#silverIcon)" stroke-width="3" />

      <!-- Folha Esquerda -->
      <path d="M 240,320 C 200,300 185,265 185,265 C 185,265 225,275 240,320 Z" fill="none" stroke="url(#silverIcon)" stroke-width="5" stroke-linejoin="round" />
      
      <!-- Folha Direita -->
      <path d="M 260,320 C 300,300 315,265 315,265 C 315,265 275,275 260,320 Z" fill="none" stroke="url(#silverIcon)" stroke-width="5" stroke-linejoin="round" />

      <!-- Ondas Inferiores / Água -->
      <path d="M 155,310 C 185,290 215,330 245,310 C 275,290 305,330 345,310" fill="none" stroke="url(#silverIcon)" stroke-width="5" stroke-linecap="round" />
      <path d="M 175,330 C 200,315 225,340 250,325 C 275,310 300,340 325,325" fill="none" stroke="url(#silverIcon)" stroke-width="4" stroke-linecap="round" />
    </g>

    <!-- Texto Inferior em Curva "Tudo sobre aquário" -->
    <text class="sub-text">
      <textPath href="#textArc" startOffset="50%" text-anchor="middle">
        Tudo sobre aquário
      </textPath>
    </text>

  </g>
</svg>
'''

with open("logo_aquaristapro.svg", "w", encoding="utf-8") as f:
    f.write(svg_content)

print("[file-tag: logo_aquaristapro.svg]")