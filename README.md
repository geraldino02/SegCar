# SegCar 

Sistema de monitoramento e rastreamento veicular com integração de hardware (GPS/Arduino) e painel web.

---

##  Sobre o Projeto

O **SegCar** é uma solução para rastreamento de veículos em tempo real. Ele combina:
- **Dispositivo Embarcado**: Coleta coordenadas de GPS e dados do veículo via microcontrolador.
- **Painel Web**: Interface para acompanhamento em tempo real, histórico de rotas e administração.

---

## Estrutura dos Arquivos

| Arquivo / Pasta | Descrição |
| :--- | :--- |
| `login.html` / `registro.html` | Telas de acesso e cadastro de usuários |
| `dashboard.html` / `dashboard.js` | Painel principal com mapa e dados do percurso em tempo real |
| `admin.html` / `admin.js` | Painel administrativo do sistema |
| `mock_gps.html` | Simulador de rotas/GPS para testes sem dispositivo físico |
| `sketch_jul12a/` | Código fonte do microcontrolador (Arduino/C++) para o sensor GPS |
| `serial_bridge.ps1` | Script PowerShell para ponte de dados da porta serial |
| `arquitetura_segcar.pdf` | Documentação de arquitetura do sistema |

---

##  Como Executar Localmente

1. **Iniciar Servidor Web**:
   - Abra o painel do **XAMPP** e inicie o módulo **Apache**.
   - O projeto deve estar na pasta: `C:\xampp\htdocs\SegCar`.

2. **Acessar o Sistema**:
   - No navegador, acesse:
     ```text
     http://localhost/SegCar/login.html
     ```

3. **Testar com GPS Simulado**:
   - Caso não esteja com o hardware conectado, abra:
     ```text
     http://localhost/SegCar/mock_gps.html
     ```

